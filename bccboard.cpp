
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
static unsigned short* indices   = NULL;

static int   texturesSz = 0;
static float* textures = NULL;

//tex coords will be sep, should be based on cell content
static void genTexCoords(int w, int h){
    texturesSz = 8*w*h;
    textures   = new float[texturesSz];

    int idx = 0;
    for(int i = 0; i < h; i++)
    {
        for(int j = 0; j < w; j++)
        {
            textures[idx++] = 1.0f;
            textures[idx++] = 0.0f;

            textures[idx++] = 0.0f;
            textures[idx++] = 0.0f;

            textures[idx++] = 1.0f;
            textures[idx++] = 1.0f;

            textures[idx++] = 1.0f;
            textures[idx++] = 0.0f;
        }
    }
}
static void genBuffers(int w, int h){

    char buff[2048];

    int idx = 0;

    verticesSz = (w+1) * (h+1) * 2;
    vertices   = new float[verticesSz];

#if 1

    indicesSz = 3 * 2 * w * h;
#else
    //(4+ (w-1) * 2) * h + 2*(h-1)
    indicesSz = 4*h + 2*h*w - 2;
#endif

    indices = new unsigned short[indicesSz];

    sprintf(buff,"%d %d %d %d\n",w, h, verticesSz, indicesSz );
    qDebug()<<buff;

    for(int i = 0; i < h + 1 ; i++){
        for(int j = 0; j < w + 1; j++){

            vertices[idx++] = (float)j;
            vertices[idx++] = (float)i;


            sprintf(buff, "[%d,%d] = {%d,%d}",(idx-2),(idx-1),j,i);
            qDebug()<<buff;//<<"\n";
        }
    }


    idx = 0;
qDebug()<<"\n";

#if 1
    const int wp1 = w+1;
    for(int i=0;i<h;i++)
    {
        //int a = i * (w+1);
        //int a2 = a * 2;
        for(int j=0;j<w;j++)
        {
            const int jp1 = i * wp1 + j /*+ 1*/;

            indices[ idx++ ] = jp1;
            indices[ idx++ ] = jp1 + wp1;
            indices[ idx++ ] = jp1 +1;
            sprintf(buff, "[%d,%d,%d] = {%d,%d,%d}",(idx-3),(idx-2),(idx-1),indices[idx-3], indices[idx-2], indices[idx-1] );
            qDebug()<<buff;

            indices[ idx++ ] = jp1 +1;
            indices[ idx++ ] = jp1 + wp1;
            indices[ idx++ ] = jp1 + wp1 +1;
            sprintf(buff, "[%d,%d,%d] = {%d,%d,%d}",(idx-3),(idx-2),(idx-1),indices[idx-3], indices[idx-2], indices[idx-1] );
            qDebug()<<buff;
        }
    }
#else
const int wp1 = w+1;
for(int i=0;i<h;i++)
{
    //int a = i * (w+1);
    //int a2 = a * 2;
    for(int j=0;j<wp1;j++)
    {
        const int jp1 = i * wp1 + j /*+ 1*/;

        if(j == 0 && i > 0){
            indices[ idx++ ] = jp1;
            sprintf(buff, "[%d] = {%d}", (idx-1), indices[idx-1] );
            qDebug()<<buff;//<<"\n";
        }


        indices[ idx++ ] = jp1;
        indices[ idx++ ] = jp1 + wp1;

        sprintf(buff, "[%d,%d] = {%d,%d}",(idx-2),(idx-1), indices[idx-2], indices[idx-1] );
        qDebug()<<buff;//<<"\n";

        if(j == w && i+1 < h){
            indices[ idx++ ] = jp1 + wp1;
            sprintf(buff, "[%d] = {%d}",(idx-1),indices[idx-1] );
            qDebug()<<buff;//<<"\n";
        }
    }
}
#endif
}

enum E_Buffers{

    E_B_VERTEX = 0,
    E_B_INDEX     ,
    E_B_TEX       ,
    SZ_E_Buffers
};

static GLuint g_glBuffs[SZ_E_Buffers];
static GLuint g_texId;
static int g_smLocation;
static int g_texCoordsLocation;
#include "QFileInfo"

#define __W 2
#define __H 1
void SquircleRenderer::paint()
{


    if (!m_program) {

        initializeOpenGLFunctions();

        //==========
                genBuffers  (__W,__H);
                genTexCoords(__W,__H);

                QFile file("../res/general.png");
                QFileInfo fInfo("../res/general.png");


                qDebug() <<file.exists() << fInfo.absoluteFilePath();
                QImage image("./res/general.png");

                glGenTextures(1,&g_texId);
                glBindTexture(GL_TEXTURE_2D,g_texId);
                glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP);
                glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP);
                glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
                glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
                glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,image.width(),image.height(),0,GL_RGBA,GL_UNSIGNED_BYTE,image.mirrored(false,true).bits());
                glBindTexture(GL_TEXTURE_2D,0);
                //glGenBuffers(SZ_E_Buffers,g_glBuffs);
                //glBindBuffer(GL_ARRAY_BUFFER,g_glBuffs[E_B_VERTEX]);
                //glBufferData(GL_ARRAY_BUFFER,verticesSz*sizeof(float),vertices,GL_STATIC_DRAW);
                //
                //glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, g_glBuffs[E_B_INDEX]);
                //glBufferData(GL_ELEMENT_ARRAY_BUFFER, indicesSz*sizeof(unsigned short),indices,GL_STATIC_DRAW);
                //
                //glBindBuffer(GL_ARRAY_BUFFER,g_glBuffs[E_B_TEX]);
                //glBufferData(GL_ARRAY_BUFFER,texturesSz*sizeof(float),textures,GL_STATIC_DRAW);
                //
                //glBindBuffer(GL_ARRAY_BUFFER,0);
                //glBindBuffer(GL_ELEMENT_ARRAY_BUFFER,0);
        //==========

        m_program = new QOpenGLShaderProgram();


        m_program->addShaderFromSourceCode(QOpenGLShader::Vertex,
                                           "uniform   highp vec2 uDivs     ;\n"
                                           "attribute highp vec4 vertices ;\n"
                                           "varying   highp vec2 coords;\n"
                                           "attribute highp vec2 aTexCoords;\n"
                                           "varying   highp vec2 vTexCoords;\n"
                                           "void main() {\n"
                                           "    gl_Position = vec4(vertices.x/uDivs.x,vertices.y/uDivs.y,1.0,1.0) * 2.0 - 1.0;\n"
                                           "    vTexCoords = aTexCoords; \n"
                                           "    coords = vertices.xy;\n"
                                           "}\n");
        //vec4(vTexCoords,0.0,1.0);//
        m_program->addShaderFromSourceCode(QOpenGLShader::Fragment,
                                           "uniform   highp sampler2D sm;"
                                           "varying highp vec2 coords;"
                                           "varying highp vec2 vTexCoords;\n"
                                           "void main() {\n"
                                           "    gl_FragColor = texture2D(sm,vTexCoords,0.0).bgra;\n"
                                           "}\n");

        m_program->bindAttributeLocation("vertices", 0);



#if 0

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
#endif
        m_program->link();
        g_smLocation = m_program->uniformLocation("sm");
        g_texCoordsLocation = m_program->attributeLocation("aTexCoords");


    }
    m_program->bind();

    m_program->enableAttributeArray(0);
    m_program->enableAttributeArray(g_texCoordsLocation);

#if 0
    float values[] = {
        -1, -1,
        1, -1,
        -1, 1,
        1, 1
    };
m_program->setAttributeArray(0, GL_FLOAT, values, 2);
#endif


//float values[] = {
//    -1, -1,
//    1, -1,
//    -1, 1,
//    1, 1
//};

float values[] = {
    //non mirrored
    //0,  1,
    //0,  0,
    //1,  1,

    0,  0,
    0,  1,
    1,  0,

    1,  0,
    0,  1,
    1,  1,

    0,  0,
    0,  1,
    1,  0,

    1,  0,
    0,  1,
    1,  1
};


float values2[] = {
    0,  0,
    0,  1,
    1,  0,

    1,  0,
    0,  1,
    1,  1,

    1,  0,
    1,  1,
    2,  0,

    2,  0,
    1,  1,
    2,  1
};
//float vert[] = {
//    0,0,
//    0,1,
//    1,0,
//
//    1,0
//
//};

    //glBindBuffer(GL_ARRAY_BUFFER,g_glBuffs[E_B_VERTEX]);
    //glBindBuffer(GL_ELEMENT_ARRAY_BUFFER,g_glBuffs[E_B_INDEX]);
    //m_program->setAttributeBuffer(g_glBuffs[E_B_VERTEX],GL_FLOAT,0,2);
    //m_program->setAttributeArray(0,GL_FLOAT,values,2);
    //m_program->setAttributeArray(0,GL_FLOAT,vertices/*values*/,2);
m_program->setAttributeArray(0,GL_FLOAT,values2/*values*/,2);

    m_program->setAttributeArray(g_texCoordsLocation,GL_FLOAT,values/*values*/,2);
    //m_program->setUniformValue("t", (float) m_t);
    glBindTexture(GL_TEXTURE_2D,g_texId);
    m_program->setUniformValue("sm",0);

    m_program->setUniformValue("uDivs",(float)__W,(float)__H);

    //glViewport(0, -m_viewportSize.height(), m_viewportSize.width(), m_viewportSize.height());

    glDisable(GL_DEPTH_TEST);

    glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT);

    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE);



#if 0
    glDrawArrays(GL_TRIANGLE_STRIP, 0, 3);
#else

    glDrawArrays(GL_TRIANGLES, 0, 12);

    //glDrawElements(GL_TRIANGLES,indicesSz,GL_UNSIGNED_SHORT,indices);

#endif

    //glBindBuffer(GL_ARRAY_BUFFER        ,0);
    //glBindBuffer(GL_ELEMENT_ARRAY_BUFFER,0);

    m_program->disableAttributeArray(0);
    m_program->disableAttributeArray(g_texCoordsLocation);
    m_program->release();

    // Not strictly needed for this example, but generally useful for when
    // mixing with raw OpenGL.
    m_window->resetOpenGLState();
}
