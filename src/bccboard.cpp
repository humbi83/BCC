#include "bccboard.h"
#include <QtQuick/qquickwindow.h>


Bccboard::Bccboard()
    : m_t(0)
    , m_renderer(0)
{
    connect(this, &QQuickItem::windowChanged, this, &Bccboard::handleWindowChanged);
}

void Bccboard::setT(qreal t)
{
    if (t == m_t)
        return;
    m_t = t;
    emit tChanged();
    if (window())        
        window()->update();
}

void Bccboard::handleWindowChanged(QQuickWindow *win)
{
    if (win) {
        connect(win, &QQuickWindow::beforeSynchronizing, this, &Bccboard::sync, Qt::DirectConnection);
        connect(win, &QQuickWindow::sceneGraphInvalidated, this, &Bccboard::cleanup, Qt::DirectConnection);        
        win->setClearBeforeRendering(false);
    }
}

void Bccboard::cleanup()
{
    if (m_renderer) {
        delete m_renderer;
        m_renderer = 0;
    }
}

void Bccboard::sync()
{
    if (!m_renderer) {
        m_renderer = new BccboardRenderer();
        connect(window(), &QQuickWindow::beforeRendering, m_renderer, &BccboardRenderer::paint, Qt::DirectConnection);
    }

    m_renderer->m_callQueue.clear();
    m_renderer->m_callQueue.append(m_callQueue);
    m_callQueue.clear();


    m_renderer->m_callQueueAIOP.clear();
    m_renderer->m_callQueueAIOP.append(m_callQueueAIOP);
    m_callQueueAIOP.clear();

    m_renderer->setViewportSize(window()->size() * window()->devicePixelRatio());
    m_renderer->setT(m_t);
    m_renderer->setWindow(window());


}

//called before paint !
void Bccboard::applyBrush(
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

void Bccboard::atlasOp   (
        int opType,
        int id    ,
        int posX  ,
        int posY  ,
        int tX    ,
        int tY    ,
        int tW    ,
        int tH
        ){

    AtlasImageOps aioCall ={
        opType,
        id    ,
        posX  ,
        posY  ,
        tX    ,
        tY    ,
        tW    ,
        tH
    };
    qDebug()<<"PosX,Y "<<posX<<","<<posY;
    m_callQueueAIOP.append(aioCall);
}

