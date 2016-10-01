#ifndef BCCTEXBRUSH_H
#define BCCTEXBRUSH_H


#include <QtGui\qopenglfunctions.h>
#include <QtGui\qopenglbuffer.h>

#include "bccglobals.h"

typedef float* TFptr;

struct TexBrush
{
    TFptr* texCoords;
    int szCW;
    int szCH;

    static TexBrush* newInstanceT(int tX, int tY, int tW, int tH, int texW, int texH, int cellW = __CELL_W, int cellH = __CELL_W);

    //so I can do multiple modifs/copyTo on host side && then manually do apply
    static void preCopy (QOpenGLFunctions* oglFunc, QOpenGLBuffer& buffer);
    static void postCopy(QOpenGLFunctions* oglFunc, QOpenGLBuffer& buffer, float* srcBuff /*= tex*/);

    void copyTo(int cellX, int cellY, float* buffer/* = tex*/, int noCellW = __W , int noCellH = __H);

    void applyTo(QOpenGLFunctions* oglFunc, QOpenGLBuffer& buffer, int cellX, int cellY, float* srcBuff/* = tex*/, int noCellW =__W, int noCellH = __H);
};

#endif // BCCTEXBRUSH_H
