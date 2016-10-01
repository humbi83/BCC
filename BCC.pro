TEMPLATE = app

QT += qml quick
CONFIG += c++11

INCLUDEPATH += include
HEADERS += include/bccboard.h

SOURCES += src/main.cpp
SOURCES += src/bccboard.cpp

# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH += qml

# Default rules for deployment.
include(deployment.pri)

DISTFILES += \
    qml/MainForm.ui.qml \
    qml/BBCAtlas.qml \
    qml/BBCAtlasFrame.qml \
    qml/BBCAtlasFrameList.qml \
    qml/BBCBase.qml \
    qml/BBCBoard.qml \
    qml/BBCFactory.qml \
    qml/BBCIVec.qml \
    qml/BBCLevel.qml \
    qml/BBCLevel1.qml \
    qml/BBCLevelCell.qml \
    qml/BBCList.qml \
    qml/BBCListElement.qml \
    qml/BBCRect.qml \
    qml/BBCRectangle.qml \
    qml/BBCTank.qml \
    qml/BCCListCursor.qml \
    qml/main.qml \
    js/BCCAtlasCPPPainter.js \
    js/BCCBaseDoodadPainter.js \
    js/BCCBullet.js \
    js/BCCColorDoodadPainter.js \
    js/BCCDoodad.js \
    js/BCCDoodadFactory.js \
    js/BCCFrameSequenceCPPPainter.js \
    js/BCCFrameSequencePainter.js \
    js/BCCGameMaster.js \
    js/BCCGfx.js \
    js/BCCGlobal.js \
    js/BCCLevel.js \
    js/BCCLevelCell.js \
    js/BCCLevelPainter.js \
    js/BCCMain.js \
    js/BCCMainAtlasDoodadPainter.js \
    js/BCCMultiFrameDoodad.js \
    js/BCCPUp.js \
    js/BCCTank.js \
    js/BCCTankAI.js \
    js/BCCVec.js \
    res/BCCGameOver.png \
    res/BCCMenuBottom.png \
    res/BCCMenuListCursorFrames.png \
    res/BCCMenuMail.png \
    res/BCCMenuMiddle.png \
    res/BCCMenuPhone.png \
    res/general.png \
    res/general_org.png


CONFIG(debug, debug|release) {
    DESTDIR = $$OUT_PWD/debug
} else {
    DESTDIR = $$OUT_PWD/release
}


#For what ever reason "make install" is not called. Maybe it's a windows thing
#for Windows add Run Settings/ Depl / jom -f Makefile.[Debug|Release] install

qml.path  = $$shell_path($$DESTDIR/qml)
qml.files = $$shell_path($$_PRO_FILE_PWD_/qml/*)
INSTALLS += qml

js.path  = $$shell_path($$DESTDIR/js)
js.files = $$shell_path($$_PRO_FILE_PWD_/js/*)
INSTALLS += js

res.path  = $$shell_path($$DESTDIR/res)
res.files = $$shell_path($$_PRO_FILE_PWD_/res/*)
INSTALLS += res
