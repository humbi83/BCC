#ifndef BCCGLOBALS_H
#define BCCGLOBALS_H

#define _CLAMP(v,l,h) (v < l ? l : ( v > h ? h : v))
#define CLAMP(v,l,h) _CLAMP((v),(l),(h))

#define __LB 4
#define __GW 52
#define __RB 8

#define __TB 4
#define __GH 52
#define __LB 4

#define __W (__LB + __GW + __RB)
#define __H (__TB + __GH + __LB)

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

#endif // BCCGLOBALS_H
