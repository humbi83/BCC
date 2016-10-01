#ifndef BCCBOARD_H
#define BCCBOARD_H

#include <QtQuick/QQuickItem>
#include "bccboardrenderer.h"

class Bccboard : public QQuickItem
{
    Q_OBJECT
    Q_PROPERTY(qreal t READ t WRITE setT NOTIFY tChanged)

    QList<BrushCall> m_callQueue;
    QList<AtlasImageOps> m_callQueueAIOP;
public:
    Bccboard();

    qreal t() const { return m_t; }
    void setT(qreal t);

    //One shot
    Q_INVOKABLE void applyBrush(qreal cellX, qreal cellY, qreal tX, qreal tY, qreal tW, qreal tH, qreal repeatX = 1 , qreal repeatY = 1 );
    Q_INVOKABLE void atlasOp   (
            int opType,
            int id    ,
            int posX  ,
            int posY  ,
            int tX    ,
            int tY    ,
            int tW    ,
            int tH
            );

signals:
    void tChanged();

public slots:
    void sync();
    void cleanup();



private slots:
    void handleWindowChanged(QQuickWindow *win);

private:
    qreal m_t;
    BccboardRenderer *m_renderer;
};

#endif // BCCBOARD_H
