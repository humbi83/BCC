
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

    m_renderer->m_callQueue.clear();
    m_renderer->m_callQueue.append(m_callQueue);
    m_callQueue.clear();

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

#define __W 52
#define __H 52

#define __CELL_W 4
#define __CELL_H 4

//#define DO_LOGGING

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
        for(float j=0;j<w;j++)
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
    tex = new float[texSz]{0.0f};
#if 0
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
            tex[ idx++ ] = 1 / float(w-j);
            BLOG2();

            tex[ idx++ ] = 1/float(w-j);
            tex[ idx++ ] = 0;
            BLOG2();

            tex[ idx++ ] = 1/float(w-j);
            tex[ idx++ ] = 0;
            BLOG2();

            tex[ idx++ ] = 0;
            tex[ idx++ ] = 1/float(w-j);
            BLOG2();

            tex[ idx++ ] = 1/float(w-j);
            tex[ idx++ ] = 1/float(w-j);
            BLOG2();
        }
    }
#endif
}

#if 0
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

    //sprintf(buff,"%d %d %d %d\n",w, h, verticesSz, indicesSz );
    //qDebug()<<buff;

    for(int i = 0; i < h + 1 ; i++){
        for(int j = 0; j < w + 1; j++){

            vertices[idx++] = (float)j;
            vertices[idx++] = (float)i;


            //sprintf(buff, "[%d,%d] = {%d,%d}",(idx-2),(idx-1),j,i);
            //qDebug()<<buff;//<<"\n";
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

#endif


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
        buff[ 0] = float(x)   / float(texW);
        buff[ 1] = float(y)   / float(texH);
        buff[ 2] = float(x)   / float(texW);
        buff[ 3] = float(y+h) / float(texH);
        buff[ 4] = float(x+w) / float(texW);
        buff[ 5] = float(y  ) / float(texH);
        buff[ 6] = float(x+w) / float(texW);
        buff[ 7] = float(y  ) / float(texH);
        buff[ 8] = float(x)   / float(texW);
        buff[ 9] = float(y+h) / float(texH);
        buff[10] = float(x+w) / float(texW);
        buff[11] = float(y+h) / float(texH);

        //printFBuffer(buff,12);

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

    //TODO: CHECKS
    static TexBrush* newInstanceT(int tX, int tY, int tW, int tH, int texW, int texH, int cellW = __CELL_W, int cellH = __CELL_W){
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


    void copyTo(int cellX, int cellY, float* buffer = tex, int noCellW = __W , int noCellH = __H)
    {
        Q_UNUSED(noCellH);
        int scanLine = szCW * 12 * sizeof(float);
        for(int i = 0 ; i < szCH; i++)
        {
            int idxTexCoords = szCH - i -1;
            float* offBuff= buffer + ((i+cellY) * noCellW + cellX) * 12;
            memcpy(offBuff, texCoords[idxTexCoords], scanLine );
        }
    }


    //so I can do multiple modifs/copyTo on host side && then manually do apply
    static void preCopy (QOpenGLFunctions* oglFunc, QOpenGLBuffer& buffer)
    {

        buffer.bind();
        oglFunc->glBufferData(buffer.type(), buffer.size(), NULL, buffer.usagePattern());
    }


    static void postCopy(QOpenGLFunctions* oglFunc, QOpenGLBuffer& buffer, float* srcBuff = tex)
    {
        oglFunc->glBufferData(buffer.type(), buffer.size(), srcBuff, buffer.usagePattern());
        buffer.release();
    }

    void applyTo(QOpenGLFunctions* oglFunc, QOpenGLBuffer& buffer, int cellX, int cellY, float* srcBuff = tex, int noCellW =__W, int noCellH = __H)
    {    
        preCopy(oglFunc, buffer);

        copyTo(cellX,cellY,srcBuff,noCellW,noCellH);

        postCopy(oglFunc, buffer);
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

    //printFBuffer(buffer);
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

#define _CLAMP(v,l,h) (v < l ? l : ( v > h ? h : v))
#define CLAMP(v,l,h) _CLAMP((v),(l),(h))

void SquircleRenderer::applyBrush(const BrushCall& params)
{

    //TODO:ALEX add real bounds !
    int _cellX   = int(floorf(CLAMP(float(params.cellX  ),0.0f , __W)));
    int _cellY   = int(floorf(CLAMP(float(params.cellY  ),0.0f , __H)));
    int _tX      = int(floorf(CLAMP(float(params.tX     ),0.0f , 1024)));
    int _tY      = int(floorf(CLAMP(float(params.tY     ),0.0f , 1024)));
    int _tW      = int(floorf(CLAMP(float(params.tW     ),1.0f , 1024)));
    int _tH      = int(floorf(CLAMP(float(params.tH     ),1.0f , 1024)));
    int _repeatX = int(floorf(CLAMP(float(params.repeatX),1.0f ,   10)));
    int _repeatY = int(floorf(CLAMP(float(params.repeatY),1.0f ,   10)));

    TexBrush* tb = TexBrush::newInstanceT(_tX,_tY,_tW,_tH,m_imageW,m_imageH);

    //qDebug() << cellX <<" " << cellY << " " << (52 - (cellY + tH/4)) << " "<< repeatX <<" "<< repeatY;
    //52 - (cellY + tH/4)

    TexBrush::preCopy(this,*m_textureBuffer);

    int thd4 = _tH/4;
    int twd4 = _tW/4;
    for(int i=0;i<_repeatY;i++)
    {
        int y = _cellY+ i * thd4;
        int yRev = __H - y - thd4;
        for(int j=0;j<_repeatX;j++)
        {
            tb->copyTo(_cellX+j*twd4, yRev );
        }
    }

    TexBrush::postCopy(this,*m_textureBuffer);

    delete tb;
}
//called before paint !
void Squircle::applyBrush(
        qreal cellX, qreal cellY,
        qreal tX, qreal tY,
        qreal tW, qreal tH,
        qreal repeatX,
        qreal repeatY)
{
    //I might need to invalidate stuff in order for the repaint to happen

    BrushCall brushCall={cellX, cellY , tX,tY,tW,tH,repeatX,repeatY};
    m_callQueue.append(brushCall);

}

void SquircleRenderer::paint()
{


    if (!m_program) {

        initializeOpenGLFunctions();

        //==========

        genTex(__W,__H);
        genBuffers2(__W,__H);


        QFileInfo fInfo("./res/general.png");

        qDebug() <<fInfo.exists() << fInfo.absoluteFilePath();
        QImage image("./res/general.png");

        m_imageW = image.width();
        m_imageH = image.height();

        //make this a QOpenGLTexture ... why ???
        glGenTextures(1,&g_texId);
        glBindTexture(GL_TEXTURE_2D,g_texId);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,m_imageW,m_imageH,0,GL_RGBA,GL_UNSIGNED_BYTE,image.mirrored(false,true).bits());
        glBindTexture(GL_TEXTURE_2D,0);


        m_vertexBuffer = new QOpenGLBuffer(QOpenGLBuffer::VertexBuffer);
        m_vertexBuffer->create();
        m_vertexBuffer->bind();
        m_vertexBuffer->setUsagePattern(QOpenGLBuffer::StaticDraw);
        m_vertexBuffer->allocate(vert,vertSz * sizeof(float));
        //m_vertexBuffer->allocate(values2,sizeof(values2));
        m_vertexBuffer->release();

        //Hmm.. not nice.. I have to upload
        //52*52*12*4 .. 120k ... per update.. anyway .. pc

        //but in fragment sh ..
        //16/3 ... 52/3 ->18 per line * 52 = 936 <1k on update
        // 5b - > 31 types ... mmm
        //8/1 52*52 ~ 2k-3k per update + 256 * 4 * 4 + 4k LUT .. resonable
        //2 orders of mag lower busload
        //not now

        m_textureBuffer = new QOpenGLBuffer(QOpenGLBuffer::VertexBuffer);
        m_textureBuffer->create();
        m_textureBuffer->bind();
        m_textureBuffer->setUsagePattern(QOpenGLBuffer::StaticDraw);
        m_textureBuffer->allocate(tex,texSz* sizeof(float));
        m_textureBuffer->release();

        //printFBuffer(*m_textureBuffer);

        //TexCoords tC; tC.setT(256,0,16,16,image.width(), image.height());
        //setCell(0,0,tC,*m_textureBuffer);



        //not necessarly here, but for clarity
        TexBrush::preCopy(this,*m_textureBuffer);


        TexBrush* tb = TexBrush::newInstanceT(0,0,16,16,m_imageW,m_imageH);
        for(int i=0;i<7;i++)
        {
            for(int j=0;j<13;j++)
            {
                tb->copyTo(j*4,i*4);
            }
        }

        TexBrush::postCopy(this,*m_textureBuffer);



        TexBrush* tb2 = TexBrush::newInstanceT(256,16,16,16,m_imageW,m_imageH);
        tb2->applyTo(this,*m_textureBuffer,16,16);


        //someQ.applyBrush(16,16,256,0,16,16);

        //TexBrush* tb = TexBrush::newInstanceT(0,0,16,16,image.width(),image.height(),4,4);
        //tb->applyTo(this,*m_textureBuffer,0,0,__W, __H);

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


    //for(int i=0 ;i)

    while(m_callQueue.size() > 0)
    {
        applyBrush(m_callQueue.first());
        m_callQueue.removeFirst();
    }

    m_program->bind();

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
