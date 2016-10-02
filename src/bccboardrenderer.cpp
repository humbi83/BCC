#include "bccboardrenderer.h"
#include "bcctexbrush.h"

#include "QFileInfo"
#include "QImage"
#include <QtQuick/qquickwindow.h>

typedef float* fPtr;
typedef QOpenGLBuffer* bPtr;

static int    g_vertSz = 0;
static float* g_vert   = NULL;

static int    g_texSz = 0;
static float* g_tex   = NULL;

static void printFBuffer(float* fBuff, int buffsz);
static void printFBuffer(QOpenGLBuffer& buffer);

static void genDynVertData(QOpenGLFunctions* oglFunc, bPtr& qBuffer, const QMap<int,AtlasImageOps>& map );
static void genStaticVertData   (int w, int h);
static void genStaticTexData    (int w, int h);


void BccboardRenderer::applyBrush(const BrushCall& params)
{
    //TODO:ALEX make these ints
    //TODO:ALEX add real bounds !
    int _cellX   = int(floorf(CLAMP(float(params.cellX  ),0.0f , __W)));
    int _cellY   = int(floorf(CLAMP(float(params.cellY  ),0.0f , __H)));
    int _tX      = int(floorf(CLAMP(float(params.tX     ),0.0f , 1024)));
    int _tY      = int(floorf(CLAMP(float(params.tY     ),0.0f , 1024)));
    int _tW      = int(floorf(CLAMP(float(params.tW     ),1.0f , 1024)));
    int _tH      = int(floorf(CLAMP(float(params.tH     ),1.0f , 1024)));
    int _repeatX = int(floorf(CLAMP(float(params.repeatX),1.0f ,   __W / __CELL_W)));
    int _repeatY = int(floorf(CLAMP(float(params.repeatY),1.0f ,   __H / __CELL_H)));

    TexBrush* tb = TexBrush::newInstanceT(_tX,_tY,_tW,_tH,m_imageW,m_imageH);

    char buff[512];
    sprintf(buff, "%d %d %d %d %d %d %d %d",
            _cellX  ,
            _cellY  ,
            _tX     ,
            _tY     ,
            _tW     ,
            _tH     ,
            _repeatX,
            _repeatY
            );
    qDebug() << buff;

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
            tb->copyTo(_cellX + j*twd4 , yRev, g_tex );
        }
    }

    TexBrush::postCopy(this, *m_textureBuffer, g_tex);

    delete tb;
}


//TODO: floats !!!!
void BccboardRenderer::atlasOp   (const AtlasImageOps& callParams){
    m_dynImagesDirty = true;

    switch (callParams.opType) {
    case E_AIO_ADD:{
        m_dynImages.insert(callParams.id,callParams);
    }break;
    case E_AIO_MOV:{
        auto it = m_dynImages.find(callParams.id);
        it->posX = callParams.posX;
        it->posY = callParams.posY;
    }break;
    case E_AIO_RMV:{
        m_dynImages.remove(callParams.id);
    }break;
    default:
        m_dynImagesDirty = false;
        break;
    }
}

void BccboardRenderer::selfInitOnFirstPaint(){

    initializeOpenGLFunctions();

    //==========

    genStaticTexData(__W,__H);
    genStaticVertData(__W,__H);


    QFileInfo fInfo("./res/general.png");

    qDebug() <<fInfo.exists() << fInfo.absoluteFilePath();
    QImage image("./res/general.png");

    m_imageW = image.width();
    m_imageH = image.height();

    //make this a QOpenGLTexture ... why ???
    glGenTextures(1,&m_texId);
    glBindTexture(GL_TEXTURE_2D,m_texId);
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
    m_vertexBuffer->allocate(g_vert,g_vertSz * sizeof(float));
    //m_vertexBuffer->allocate(values2,sizeof(values2));
    m_vertexBuffer->release();


    //Hmm.. not nice.. I have to upload
    //52*52*12*4 .. 120k ... per static update.. anyway .. PC

    //but in fragment sh ..
    //16/3 ... 52/3 ->18 per line * 52 = 936 <1k on update
    // 5b - > 31 types ... mmm
    //8/1 52*52 ~ 2k-3k per update + 256 * 4 * 4 + 4k LUT .. resonable sooo 1k update + static 4k LUT
    //2 orders of mag lower busload
    //not now

    m_textureBuffer = new QOpenGLBuffer(QOpenGLBuffer::VertexBuffer);
    m_textureBuffer->create();
    m_textureBuffer->bind();
    m_textureBuffer->setUsagePattern(QOpenGLBuffer::StaticDraw);
    m_textureBuffer->allocate(g_tex,g_texSz* sizeof(float));
    m_textureBuffer->release();


    m_program = new QOpenGLShaderProgram();


    m_program->addShaderFromSourceCode(QOpenGLShader::Vertex,
                                       "uniform   highp vec2 uDivs    ;\n"
                                       "attribute highp vec4 vertices ;\n"
                                       "varying   highp vec2 coords;\n"
                                       "attribute highp vec2 aTexCoords;\n"
                                       "varying   highp vec2 vTexCoords;\n"
                                       "void main() {\n"
                                       "    //lool...forgot .. in glsl 1x you need to spec gl_Pos out val\n"
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
                                       "    //default qt, if supported is BGRA, just swizzle it here\n"
                                       "    gl_FragColor = texture2D(sm,vTexCoords,0.0).bgra;\n"
                                       "}\n");

    m_program->bindAttributeLocation("vertices", 0);


    m_program->link();
    m_smLocation        = m_program->uniformLocation("sm");
    m_texCoordsLocation = m_program->attributeLocation("aTexCoords");

}
void BccboardRenderer::paint()
{
    if (!m_program) {
        selfInitOnFirstPaint();
    }


    while(m_callQueueAIOP.size() > 0)
    {
        atlasOp(m_callQueueAIOP.first());
        m_callQueueAIOP.removeFirst();
    }

    while(m_callQueue.size() > 0)
    {
        applyBrush(m_callQueue.first());
        m_callQueue.removeFirst();
    }

    genDynVertData(this,m_dynObjBuffer,m_dynImages);

    m_program->bind();

    m_vertexBuffer->bind();
    glVertexAttribPointer(0,2,GL_FLOAT,0,0,0);
    m_program->enableAttributeArray(0);

    m_textureBuffer->bind();
    glVertexAttribPointer(m_texCoordsLocation,2,GL_FLOAT,0,0,0);
    m_program->enableAttributeArray(m_texCoordsLocation);

    glBindTexture(GL_TEXTURE_2D,m_texId);
    m_program->setUniformValue("sm",0);

    m_program->setUniformValue("uDivs",(float)__W,(float)__H);

    glDisable(GL_DEPTH_TEST);

    glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT);

    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE);

    glDrawArrays(GL_TRIANGLES, 0, g_vertSz);

    m_program->disableAttributeArray(0);
    m_program->disableAttributeArray(m_texCoordsLocation);

    if(m_dynObjBuffer != NULL)
    {
        m_dynObjBuffer->bind();
        glVertexAttribPointer(0                  , 2, GL_FLOAT, 0, 4*sizeof(float),(void*)(0              ));
        glVertexAttribPointer(m_texCoordsLocation, 2, GL_FLOAT, 0, 4*sizeof(float),(void*)(2*sizeof(float)));
        m_program->enableAttributeArray(0);
        m_program->enableAttributeArray(m_texCoordsLocation);

        glDrawArrays(GL_TRIANGLES, 0,m_dynObjBuffer->size()/sizeof(float));

        m_program->disableAttributeArray(0);
        m_program->disableAttributeArray(m_texCoordsLocation);
    }


    glBindBuffer (GL_ARRAY_BUFFER ,0);
    glBindTexture(GL_TEXTURE_2D   ,0);
    //glBindBuffer(GL_ELEMENT_ARRAY_BUFFER,0);


    m_program->release();

    //just to be sure
    m_window->resetOpenGLState();
}

BccboardRenderer::~BccboardRenderer()
{
    delete m_program;
    delete m_vertexBuffer;
    delete m_textureBuffer;
    delete m_dynObjBuffer;
}

static void genStaticVertData(int w, int h)
{
    g_vertSz = w*h*12;
    g_vert = new float[g_vertSz];

    int idx = 0;
    char buff[2048];
    Q_UNUSED(buff);
    const int wp1 = w+1;

    for(int i=0;i<h;i++)
    {
        int ip1 = i+1;
        for(float j=0;j<w;j++)
        {
            int jp1 = j+1;
            g_vert[ idx++ ] = j;
            g_vert[ idx++ ] = i;
            BLOG1();

            g_vert[ idx++ ] = j;
            g_vert[ idx++ ] = ip1;
            BLOG1();

            g_vert[ idx++ ] = jp1;
            g_vert[ idx++ ] = i;
            BLOG1();

            g_vert[ idx++ ] = jp1;
            g_vert[ idx++ ] = i;
            BLOG1();

            g_vert[ idx++ ] = j;
            g_vert[ idx++ ] = ip1;
            BLOG1();

            g_vert[ idx++ ] = jp1;
            g_vert[ idx++ ] = ip1;
            BLOG1();
        }
    }
}

static void genStaticTexData(int w,int h){
    g_texSz = w*h*12;
    g_tex = new float[g_texSz]{0.0f};
}

//x,y,u,v
static void genDynVertData(QOpenGLFunctions* oglFunc, bPtr& qBuffer, const QMap<int,AtlasImageOps>& map )
{


    int buffSz = 2* 12* map.size() ;
    fPtr buffer = buffSz == 0 ? NULL : new float[buffSz];

    int idx = 0;

    QMapIterator<int, AtlasImageOps> i(map);
    while (i.hasNext()) {
        i.next();
        static const float cellH = float(__CELL_H);
        static const float cellW = float(__CELL_W);


        float x = float(i.value().posX) / cellW;
        float y = (float(__H) * cellH - float(i.value().posY) - float(i.value().tH))/ cellH;
        float w = float(i.value().tW  ) / cellW;
        float h = float(i.value().tH  ) / cellH;

        float tx = i.value().tX / 400.0f;
        float ty = (256.0f - i.value().tY - i.value().tH ) / 256.0f;
        float tw = i.value().tW / 400.0f;
        float th = i.value().tH / 256.0f;

        buffer[ idx++ ] =  x;
        buffer[ idx++ ] =  y;
        buffer[ idx++ ] = tx;

        buffer[ idx++ ] = ty;
        //buffer[ idx++ ] = ty + th;

        buffer[ idx++ ] = x;
        buffer[ idx++ ] = y+h;
        buffer[ idx++ ] = tx;

        buffer[ idx++ ] = ty+th;
        //buffer[ idx++ ] = ty;

        buffer[ idx++ ] = x+w;
        buffer[ idx++ ] = y;
        buffer[ idx++ ] = tx+tw;

        buffer[ idx++ ] = ty;
        //buffer[ idx++ ] = ty + th;

        buffer[ idx++ ] = x+w;
        buffer[ idx++ ] = y;
        buffer[ idx++ ] = tx+tw;

        buffer[ idx++ ] = ty;
        //buffer[ idx++ ] = ty + th;

        buffer[ idx++ ] = x;
        buffer[ idx++ ] = y+h;
        buffer[ idx++ ] = tx;

        buffer[ idx++ ] = ty+th;
        //buffer[ idx++ ] = ty;

        buffer[ idx++ ] = x+w;
        buffer[ idx++ ] = y+h;
        buffer[ idx++ ] = tx+tw;

        buffer[ idx++ ] = ty+th;
        //buffer[ idx++ ] = ty;
    }

    if(qBuffer){
      qBuffer->bind();
      //I presume it is considered respecified also in the case that the size is diff (next call)
      oglFunc->glBufferData(qBuffer->type(), qBuffer->size(), NULL, qBuffer->usagePattern());
    }

    if(qBuffer == NULL && buffer){
        qBuffer = new QOpenGLBuffer(QOpenGLBuffer::VertexBuffer);
        qBuffer->create();
        qBuffer->bind();
        qBuffer->allocate(buffer,buffSz * sizeof(float));
        qBuffer->setUsagePattern(QOpenGLBuffer::StreamDraw);
    }

    if(qBuffer){
        oglFunc->glBufferData(qBuffer->type(), buffSz*sizeof(float), buffer, qBuffer->usagePattern());
        qBuffer->release();
    }

    delete [] buffer;
}

static void printFBuffer(float* fBuff, int buffsz)
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
static void printFBuffer(QOpenGLBuffer& buffer)
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
