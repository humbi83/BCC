#include "bcctexbrush.h"
#include "bcctexcoords.h"

//TODO: CHECKS
TexBrush* TexBrush::newInstanceT(int tX, int tY, int tW, int tH, int texW, int texH, int cellW, int cellH){
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

//so I can do multiple modifs/copyTo on host side && then manually do apply
void TexBrush::preCopy (QOpenGLFunctions* oglFunc, QOpenGLBuffer& buffer)
{

    buffer.bind();
    oglFunc->glBufferData(buffer.type(), buffer.size(), NULL, buffer.usagePattern());
}


void TexBrush::postCopy(QOpenGLFunctions* oglFunc, QOpenGLBuffer& buffer, float* srcBuff)
{
    oglFunc->glBufferData(buffer.type(), buffer.size(), srcBuff, buffer.usagePattern());
    buffer.release();
}

void TexBrush::copyTo(int cellX, int cellY, float* buffer, int noCellW , int noCellH)
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

void TexBrush::applyTo(QOpenGLFunctions* oglFunc, QOpenGLBuffer& buffer, int cellX, int cellY, float* srcBuff/*maybe backingbuff*/, int noCellW, int noCellH)
{
    preCopy(oglFunc, buffer);

    copyTo(cellX,cellY,srcBuff,noCellW,noCellH);

    postCopy(oglFunc, buffer, srcBuff);
}

