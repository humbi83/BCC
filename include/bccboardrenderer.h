#ifndef BCCBOARDRENDERER_H
#define BCCBOARDRENDERER_H

#include <QtGui/QOpenGLShaderProgram>
#include <QtGui/QOpenGLFunctions>
#include <QtGui/QOpenGLBuffer>

enum E_AIO{
  NV_E_AIO = 0,
  E_AIO_ADD   ,
  E_AIO_MOV   ,
  E_AIO_RMV   ,
  SZ_E_AIO
};

struct AtlasImageOps
{
    int opType;
    int id    ;
    int posX  ;
    int posY  ;
    int tX    ;
    int tY    ;
    int tW    ;
    int tH    ;
};

struct BrushCall{
    qreal cellX;
    qreal cellY;
    qreal tX;
    qreal tY;
    qreal tW;
    qreal tH;
    qreal repeatX;
    qreal repeatY;
};

class QQuickWindow;

class BccboardRenderer : public QObject, protected QOpenGLFunctions
{
    Q_OBJECT
public:
    BccboardRenderer() :
        m_t(0),
        m_program(0),
        m_texId(0),
        m_smLocation(-1),
        m_texCoordsLocation(-1),
        m_vertexBuffer(0),
        m_textureBuffer(0),
        m_dynObjBuffer(0),
        m_imageW(0),
        m_imageH(0)
    { }
    ~BccboardRenderer();

    //I need this changed to invalidate
    void setT(qreal t) { m_t = t; }
    void setViewportSize(const QSize &size) { m_viewportSize = size; }
    void setWindow(QQuickWindow *window) { m_window = window; }

    //copy on sync & I'll dequeue on paint
    void applyBrush(const BrushCall& callParams);
    void atlasOp   (const AtlasImageOps& callParams);

    //Make only one
    QList<BrushCall>        m_callQueue;
    QList<AtlasImageOps>    m_callQueueAIOP;

    bool                    m_dynImagesDirty;
    QMap<int,AtlasImageOps> m_dynImages;

public slots:
    void paint();

private:
    QSize m_viewportSize;
    qreal m_t;
    QOpenGLShaderProgram *m_program;
    QQuickWindow *m_window;

    unsigned int m_texId;
    /*    */ int m_smLocation;
    /*    */ int m_texCoordsLocation;

    QOpenGLBuffer* m_vertexBuffer;
    QOpenGLBuffer* m_textureBuffer;
    QOpenGLBuffer* m_dynObjBuffer;

    int m_imageW;
    int m_imageH;

    void selfInitOnFirstPaint();
};


#endif // BCCBOARDRENDERER_H
