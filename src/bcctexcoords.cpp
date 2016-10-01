#include "bccglobals.h"
#include "bcctexcoords.h"


    float* TexCoords::sSetB(float* buff, int x, int y, int w, int h, int texW, int texH){
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

        return buff;
    }

    float* TexCoords::sSetT(float* buff,int x, int y, int w, int h, int texW, int texH)
    {
        return sSetB(buff, x,texH - y - h,w,h,texW,texH);
    }

    void  TexCoords::setB(int x, int y, int w, int h, int texW, int texH)
    {

        sSetB(texCoords, x, y, w, h, texW, texH);
    }

    void  TexCoords::setT(int x, int y, int w, int h, int texW, int texH)
    {
        sSetB(texCoords,x,texH - y - h,w,h,texW,texH);
    }

