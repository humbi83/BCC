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
    qml/BBCList.qml
