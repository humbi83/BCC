
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
    delete m_vertexBuffer;
    delete m_textureBuffer;
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

static int vertSz = 0;
static float* vert  = NULL;

static int texSz = 0;
static float* tex = NULL;

#define __W 2
#define __H 1

#ifdef DO_LOGGING
#define BLOG1() sprintf(buff, "[%d,%d] = {%f,%f}",(idx-2),(idx-1), vert[idx-2], vert[idx-1] );qDebug()<<buff
#define BLOG2() sprintf(buff, "[%d,%d] = {%f,%f}",(idx-2),(idx-1), tex[idx-2], tex[idx-1] );qDebug()<<buff
#else
#define BLOG1() Q_UNUSED(0)
#define BLOG2() Q_UNUSED(0)
#endif

static void genBuffers2(int w, int h)
{
    vertSz = w*h*12;
    vert = new float[vertSz];

    int idx = 0;
    char buff[2048];
    const int wp1 = w+1;

    for(int i=0;i<h;i++)
    {
        int ip1 = i+1;
        for(int j=0;j<w;j++)
        {
            int jp1 = j+1;
            vert[ idx++ ] = j;
            vert[ idx++ ] = i;
            BLOG1();

            vert[ idx++ ] = j;
            vert[ idx++ ] = ip1;
            BLOG1();

            vert[ idx++ ] = jp1;
            vert[ idx++ ] = i;
            BLOG1();

            vert[ idx++ ] = jp1;
            vert[ idx++ ] = i;
            BLOG1();

            vert[ idx++ ] = j;
            vert[ idx++ ] = ip1;
            BLOG1();

            vert[ idx++ ] = jp1;
            vert[ idx++ ] = ip1;
            BLOG1();
        }
    }
}

static void genTex(int w,int h){
    texSz = w*h*12;
    tex = new float[texSz];
    int idx = 0;
    char buff[2048];
    for(int i=0;i<h;i++)
    {
        for(int j=0;j<w;j++)
        {

            tex[ idx++ ] = 0;
            tex[ idx++ ] = 0;
            BLOG2();


            tex[ idx++ ] = 0;
            tex[ idx++ ] = 1;
            BLOG2();

            tex[ idx++ ] = 1;
            tex[ idx++ ] = 0;
            BLOG2();

            tex[ idx++ ] = 1;
            tex[ idx++ ] = 0;
            BLOG2();

            tex[ idx++ ] = 0;
            tex[ idx++ ] = 1;
            BLOG2();

            tex[ idx++ ] = 1;
            tex[ idx++ ] = 1;
            BLOG2();
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
#endif
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

void printFBuffer(float* fBuff, int buffsz)
{
    char buff[256];
    sprintf(buff,"%d",buffsz);
    qDebug()<<buff;

    for(int i=0;i<buffsz;i+=2)
    {
        sprintf(buff,"%f %f",fBuff[i],fBuff[i+1]);
        qDebug()<<buff;
    }
}
void printFBuffer(QOpenGLBuffer& buffer)
{
    buffer.bind();
    char buff[256];

    sprintf(buff,"%d",buffer.size());
    qDebug()<<buff;

    float* mF = (float*) buffer.mapRange(0,buffer.size(),QOpenGLBuffer::RangeRead);

    for(int i=0;i<buffer.size()/sizeof(float);i+=2)
    {
        sprintf(buff,"%f %f",mF[i],mF[i+1]);
        qDebug()<<buff;
    }

    buffer.unmap();
    buffer.release();
}


struct TexCoords
{
    float texCoords[12];

    static float* sSetB(float* buff, int x, int y, int w, int h, int texW, int texH){
        buff[ 0] = float(x)   / texW;
        buff[ 1] = float(y)   / texH;
        buff[ 2] = float(x)   / texW;
        buff[ 3] = float(y+h) / texH;
        buff[ 4] = float(x+w) / texW;
        buff[ 5] = float(y  ) / texH;
        buff[ 6] = float(x+w) / texW;
        buff[ 7] = float(y  ) / texH;
        buff[ 8] = float(x)   / texW;
        buff[ 9] = float(y+h) / texH;
        buff[10] = float(x+w) / texW;
        buff[11] = float(y+h) / texH;

        printFBuffer(buff,12);

        return buff;
    }

    static float* sSetT(float* buff,int x, int y, int w, int h, int texW, int texH)
    {
        return sSetB(buff, x,texH - y - h,w,h,texW,texH);
    }

    void  setB(int x, int y, int w, int h, int texW, int texH)
    {

        sSetB(texCoords, x, y, w, h, texW, texH);
    }

    void  setT(int x, int y, int w, int h, int texW, int texH)
    {
        sSetB(texCoords,x,texH - y - h,w,h,texW,texH);
    }

};

struct TexBrush
{
    typedef float* TFptr;
    TFptr* texCoords;
    int szCW;
    int szCH;



    static TexBrush* newInstanceT(int tX, int tY, int tW, int tH, int texW, int texH, int cellW, int cellH){
        int szCW = tW/cellW/*4*/;
        int szCH = tH/cellH/*4*/;

        TFptr* texCoords = new TFptr[szCH];
        for(int i = 0; i< szCH ; i++)
        {
            texCoords[i] = new float[szCW * 12];
            for(int j = 0; j<szCW ; j++)
            {
                TexCoords::sSetT(texCoords[i] + j * 12,
                        tX + j * cellW, tY + i * cellH,
                        cellW, cellH,
                        texW , texH );
            }
        }

        TexBrush* ret= new TexBrush{};
        ret->texCoords = texCoords;
        ret->szCW = szCW;
        ret->szCH = szCH;

        return ret;
    }


   // I should prob dbuff
    void applyTo(QOpenGLBuffer& buffer, int cellX, int cellY, int noCellW, int noCellH, bool flush = true)
    {
        Q_UNUSED(flush);
        buffer.bind();

        float* mF = (float*) buffer.mapRange(0, buffer.size(),QOpenGLBuffer::RangeWrite /*| QOpenGLBuffer::RangeFlushExplicit*/);

        int segmentSz = szCW * sizeof(TexCoords);

        for(int i = cellY; i< szCH ; i++)
        {

            int offset = sizeof(TexCoords) * (noCellW * cellY  + cellX);
            memcpy( mF + offset, texCoords[i], segmentSz);
            //here or after unmap ??
            //I do not whant a context
            //wglGetCurrentContext(void);
            //QOpenGLFunctions_3_0_CoreBackend::FlushMappedBufferRange(GL_ARRAY_BUFFER,offset,segmentSz);
        }

        buffer.unmap();

        buffer.release();

        printFBuffer(buffer);
    }
};

void setCell(const int cellX, int const cellY, const TexCoords& texCoords, QOpenGLBuffer& buffer)
{
    buffer.bind();

    int offset = 12 * (cellY * __W + cellX );

    float* mF = (float*) buffer.mapRange(offset, sizeof(TexCoords),QOpenGLBuffer::RangeWrite);
    memcpy(mF,&texCoords,sizeof(TexCoords));

    buffer.unmap();

    buffer.release();

    printFBuffer(buffer);
}


void fillBuffer(
                int cellX, int cellY ,
                int rX, int rY, int rW,int rH,
                QOpenGLBuffer& buffer,
                int tW, int tH,int noCellsW, int noCellsH)
{
    const int mulstuff = sizeof(float);
    int offset = cellY * noCellsW * mulstuff/*floats*/ * 3/*vert*/ * 2/*triang*/ + cellX * mulstuff*6;
    //float* ptr = (float*)buffer.mapRange(offset,6 * mulstuff);
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


void SquircleRenderer::paint()
{


    if (!m_program) {

        initializeOpenGLFunctions();

        //==========
                //genBuffers  (__W,__H);
                //genTexCoords(__W,__H);

                genTex(__W,__H);
                genBuffers2(__W,__H);

                QFile file("../res/general.png");
                QFileInfo fInfo("../res/general.png");


                qDebug() <<file.exists() << fInfo.absoluteFilePath();
                QImage image("./res/general.png");

                glGenTextures(1,&g_texId);
                glBindTexture(GL_TEXTURE_2D,g_texId);
                glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP);
                glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP);
                glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
                glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
                glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,image.width(),image.height(),0,GL_RGBA,GL_UNSIGNED_BYTE,image.mirrored(false,true).bits());
                glBindTexture(GL_TEXTURE_2D,0);

                glGenBuffers(SZ_E_Buffers,g_glBuffs);
                glBindBuffer(GL_ARRAY_BUFFER,g_glBuffs[E_B_VERTEX]);
                glBufferData(GL_ARRAY_BUFFER,vertSz*sizeof(float),vert,GL_STATIC_DRAW);
                glBindBuffer(GL_ARRAY_BUFFER,0);
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

                //vert coords OK
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

        m_vertexBuffer = new QOpenGLBuffer(QOpenGLBuffer::VertexBuffer);
        m_vertexBuffer->create();
        m_vertexBuffer->bind();
        m_vertexBuffer->setUsagePattern(QOpenGLBuffer::StaticDraw);
        m_vertexBuffer->allocate(vert,vertSz * sizeof(float));
        //m_vertexBuffer->allocate(values2,sizeof(values2));
        m_vertexBuffer->release();

        m_textureBuffer = new QOpenGLBuffer(QOpenGLBuffer::VertexBuffer);
        m_textureBuffer->create();
        m_textureBuffer->bind();
        m_textureBuffer->setUsagePattern(QOpenGLBuffer::StaticDraw);
        m_textureBuffer->allocate(tex,texSz* sizeof(float));
        m_textureBuffer->release();

        printFBuffer(*m_textureBuffer);

        //TexCoords tC; tC.setT(256,0,16,16,image.width(), image.height());
        //setCell(0,0,tC,*m_textureBuffer);

        //interesant .. se fac 4 ?? ?cum asa ??
        TexBrush* tb = TexBrush::newInstanceT(0,0,8,4,image.width(),image.height(),4,4);
        tb->applyTo(*m_textureBuffer,0,0,__W, __H);

        m_program = new QOpenGLShaderProgram();


        m_program->addShaderFromSourceCode(QOpenGLShader::Vertex,
                                           "uniform   highp vec2 uDivs    ;\n"
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

//works
    //m_program->setAttributeArray(0,GL_FLOAT,values2/*values*/,2);
    //m_program->setAttributeArray(g_texCoordsLocation,GL_FLOAT,values/*values*/,2);

//kinda works
    //m_program->setAttributeArray(0                  ,GL_FLOAT,vert,2);
    //glBindBuffer(GL_ARRAY_BUFFER,g_glBuffs[E_B_VERTEX]);

    //m_program->setAttributeBuffer(0,GL_FLOAT,0,2,0);

    m_vertexBuffer->bind();
    glVertexAttribPointer(0,2,GL_FLOAT,0,0,0);
    m_program->enableAttributeArray(0);

    m_textureBuffer->bind();
    glVertexAttribPointer(g_texCoordsLocation,2,GL_FLOAT,0,0,0);
    m_program->enableAttributeArray(g_texCoordsLocation);

    glBindTexture(GL_TEXTURE_2D,g_texId);
    m_program->setUniformValue("sm",0);

    m_program->setUniformValue("uDivs",(float)__W,(float)__H);

    glDisable(GL_DEPTH_TEST);

    glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT);

    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE);



#if 0
    glDrawArrays(GL_TRIANGLE_STRIP, 0, 3);
#else

    glDrawArrays(GL_TRIANGLES, 0, vertSz);


    //glDrawElements(GL_TRIANGLES,indicesSz,GL_UNSIGNED_SHORT,indices);

#endif

    glBindBuffer(GL_ARRAY_BUFFER        ,0);
    glBindTexture(GL_TEXTURE_2D,0);
    //glBindBuffer(GL_ELEMENT_ARRAY_BUFFER,0);

    m_program->disableAttributeArray(0);
    m_program->disableAttributeArray(g_texCoordsLocation);
    m_program->release();

    // Not strictly needed for this example, but generally useful for when
    // mixing with raw OpenGL.
    m_window->resetOpenGLState();
}
