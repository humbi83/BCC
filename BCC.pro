TEMPLATE = app

QT += qml quick
CONFIG += c++11

SOURCES += main.cpp

#RESOURCES +=

# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH = qml

# Default rules for deployment.
include(deployment.pri)

DISTFILES += \
    qml/MainForm.ui.qml \
    qml/BBCAtlas.qml \
    qml/main.qml \
    res/general.png \
    res/misc.png \
    qml/BBCBoard.qml \
    qml/BBCListElement.qml \
    qml/BBCList.qml \
    qml/BBCTank.qml \
    qml/BBCLevel.qml \
    qml/BBCLevel1.qml \
    qml/BBCLevelCell.qml \
    qml/BBCDoodad.qml \
    qml/BBCAtlasFrame.qml \
    qml/BBCAtlasFrameList.qml \
    qml/BBCDoodadTank.qml \
    qml/BBCDoodadEmpty.qml \
    qml/BBCBase.qml \
    qml/BBCIVec.qml \
    qml/BBCRect.qml \
    qml/BBCFactory.qml \
    qml/BCCDoodad.js \
    qml/BCCLevel.js \
    qml/BCCGlobal.js \
    qml/BCCMain.js \
    qml/BCCLevelCell.js \
    qml/BCCColorDoodadPainter.js \
    qml/BCCBaseDoodadPainter.js \
    qml/BCCMainAtlasDoodadPainter.js \
    qml/BCCVec.js \
    qml/BBCRectangle.qml \
    res/BCSnd1.mp3 \
    res/BCSnd2.mp3 \
    res/BCSnd3.mp3 \
    res/BCSnd4.mp3 \
    res/BCSnd5.mp3 \
    res/BCSnd6.mp3 \
    res/BCSnd7.mp3 \
    res/BCSnd8.mp3 \
    res/BCSnd9.mp3 \
    res/BCSnd10.mp3 \
    res/BCSnd11.mp3 \
    res/BCSnd12.mp3 \
    res/BCSnd13.mp3 \
    res/BCSnd14.mp3 \
    res/BCSnd15.mp3 \
    res/BCSnd16.mp3 \
    res/BCSnd17.mp3 \
    qml/BCCTank.js \
    qml/BCCFrameSequencePainter.js \
    qml/BCCBullet.js \
    qml/BCCPUp.js \
    qml/BCCGfx.js \
    Req.txt \
    qml/BCCVGfx.js \
    qml/BCCVPainter.js
