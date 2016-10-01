#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include "bccboard.h"

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    qmlRegisterType<Squircle>("OpenGLUnderQML", 1, 0, "Squircle");


    QQmlApplicationEngine engine;
    engine.load(QUrl(QStringLiteral("qml/main.qml")));

    return app.exec();
}
