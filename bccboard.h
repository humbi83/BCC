#ifndef BCCBOARD_H
#define BCCBOARD_H

#include <QtQuick/QQuickItem>
#include <QtGui/QOpenGLShaderProgram>
#include <QtGui/QOpenGLFunctions>
#include <QtGui/QOpenGLBuffer>

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

class SquircleRenderer : public QObject, protected QOpenGLFunctions
{
    Q_OBJECT
public:
    SquircleRenderer() : m_t(0), m_program(0), m_vertexBuffer(0),m_textureBuffer(0), m_imageW(0), m_imageH(0) { }
    ~SquircleRenderer();

    void setT(qreal t) { m_t = t; }
    void setViewportSize(const QSize &size) { m_viewportSize = size; }
    void setWindow(QQuickWindow *window) { m_window = window; }

    //copy on sync & I'll dequeue on paint
    void applyBrush(const BrushCall& callParams);

    QList<BrushCall> m_callQueue;

public slots:
    void paint();

private:    
    QSize m_viewportSize;
    qreal m_t;
    QOpenGLShaderProgram *m_program;
    QQuickWindow *m_window;

    QOpenGLBuffer* m_vertexBuffer;
    QOpenGLBuffer* m_textureBuffer;
    int m_imageW;
    int m_imageH;
};

class Squircle : public QQuickItem
{
    Q_OBJECT
    Q_PROPERTY(qreal t READ t WRITE setT NOTIFY tChanged)

    QList<BrushCall> m_callQueue;
public:
    Squircle();

    qreal t() const { return m_t; }
    void setT(qreal t);

    //======== MY STUFF ========
    //One shot
    Q_INVOKABLE void applyBrush(qreal cellX, qreal cellY, qreal tX, qreal tY, qreal tW, qreal tH, qreal repeatX = 1 , qreal repeatY = 1 );
    //I should either expose the brush or at least ret a handle
    // how about repeat functionality ???.. anyway

signals:
    void tChanged();

public slots:
    void sync();
    void cleanup();



private slots:
    void handleWindowChanged(QQuickWindow *win);

private:
    qreal m_t;
    SquircleRenderer *m_renderer;
};

#endif // BCCBOARD_H
