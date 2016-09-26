
#include "bccboard.h"

#include <QtQuick/qquickwindow.h>
#include <QtGui/QOpenGLShaderProgram>
#include <QtGui/QOpenGLContext>

Squircle::Squircle()
    : m_t(0)
    , m_renderer(0)
{
    connect(this, &QQuickItem::windowChanged, this, &Squircle::handleWindowChanged);
}

void Squircle::setT(qreal t)
{
    if (t == m_t)
        return;
    m_t = t;
    emit tChanged();
    if (window())
        window()->update();
}

void Squircle::handleWindowChanged(QQuickWindow *win)
{
    if (win) {
        connect(win, &QQuickWindow::beforeSynchronizing, this, &Squircle::sync, Qt::DirectConnection);
        connect(win, &QQuickWindow::sceneGraphInvalidated, this, &Squircle::cleanup, Qt::DirectConnection);
        // If we allow QML to do the clearing, they would clear what we paint
        // and nothing would show.
        win->setClearBeforeRendering(false);
    }
}

void Squircle::cleanup()
{
    if (m_renderer) {
        delete m_renderer;
        m_renderer = 0;
    }
}

SquircleRenderer::~SquircleRenderer()
{
    delete m_program;
}

void Squircle::sync()
{
    if (!m_renderer) {
        m_renderer = new SquircleRenderer();
        connect(window(), &QQuickWindow::beforeRendering, m_renderer, &SquircleRenderer::paint, Qt::DirectConnection);
    }
    m_renderer->setViewportSize(window()->size() * window()->devicePixelRatio());
    m_renderer->setT(m_t);
    m_renderer->setWindow(window());
}

static int    verticesSz = 0;
static float* vertices   = NULL;

static int             indicesSz = 0;
static unsigned short* indexes   = NULL;

static char* genBuffer(int w, int h){


    verticesSz = (w+1) * (h+1) * 2;
    vertices   = new float[verticesSz];

    for(int i = 0; i < h + 1 ; i++){
        int lineOffset = i*(w+1)*2;
        for(int j = 0; j < w + 1; j++){
            vertices[lineOffset + j*2    ] = (float)j;
            vertices[lineOffset + j*2 + 1] = (float)i;
        }
    }

    //(4+ (w-1) * 2) * h + 2*(h-1)
    indicesSz = 4*h + 2*h*w - 2;
    indices = new unsigned short[indicesSz];

    int idx = 0;
    const int wp1 = w+1;
    for(int i=0;i<h;i++)
    {
        //int a = i * (w+1);
        //int a2 = a * 2;
        for(int j=0;j<wp1;j++)
        {

            int limit =
                    j==0 && i   > 0 || //first on 1+ line
                    j==w && i+1 < h    //last entry on h-1 line
                    ? 2 : 1;
            for(int k =0 ; k<limit;k++){
                indices[ idx++ ] = j+1;
                indices[ idx++ ] = j+1 + wp1;
            }
        }
    }

}

void SquircleRenderer::paint()
{


    if (!m_program) {
        initializeOpenGLFunctions();


        m_program = new QOpenGLShaderProgram();
        m_program->addShaderFromSourceCode(QOpenGLShader::Vertex,
                                           "attribute highp vec4 vertices;"
                                           "varying highp vec2 coords;"
                                           "void main() {"
                                           "    gl_Position = vertices;"
                                           "    coords = vertices.xy;"
                                           "}");
        m_program->addShaderFromSourceCode(QOpenGLShader::Fragment,
                                           "uniform lowp float t;"
                                           "varying highp vec2 coords;"
                                           "void main() {"
                                           "    lowp float i = 1. - (pow(abs(coords.x), 4.) + pow(abs(coords.y), 4.));"
                                           "    i = smoothstep(t - 0.8, t + 0.8, i);"
                                           "    i = floor(i * 20.) / 20.;"
                                           "    gl_FragColor = vec4(coords * .5 + .5, i, i);"
                                           "}");

        m_program->bindAttributeLocation("vertices", 0);
        m_program->link();

    }
    m_program->bind();

    m_program->enableAttributeArray(0);

    float values[] = {
        -1, -1,
        1, -1,
        -1, 1,
        1, 1
    };
    m_program->setAttributeArray(0, GL_FLOAT, values, 2);
    m_program->setUniformValue("t", (float) m_t);

    glViewport(0, 0, m_viewportSize.width(), m_viewportSize.height());

    glDisable(GL_DEPTH_TEST);

    glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT);

    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE);

    glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);

    m_program->disableAttributeArray(0);
    m_program->release();

    // Not strictly needed for this example, but generally useful for when
    // mixing with raw OpenGL.
    m_window->resetOpenGLState();
}
