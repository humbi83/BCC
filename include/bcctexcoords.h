#ifndef BCCTTEXCOORDS_H
#define BCCTTEXCOORDS_H

//gen tex coords for 2 x triangle based & no vert sharing "rectangle" draw call

struct TexCoords
{
    float texCoords[12];

    static float* sSetB(float* buff, int x, int y, int w, int h, int texW, int texH);
    static float* sSetT(float* buff,int x, int y, int w, int h, int texW, int texH);

    void  setB(int x, int y, int w, int h, int texW, int texH);
    void  setT(int x, int y, int w, int h, int texW, int texH);
};

#endif // BCCTTEXCOORDS_H
