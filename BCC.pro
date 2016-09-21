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
    qml/BCCIVec.js \
    qml/BCCDoodad.js \
    qml/BCCLevel.js \
    qml/BCCGlobal.js \
    qml/BCCSimpleDoodadPainter.js \
    qml/BCCPainter.js \
    qml/BCCMain.js
