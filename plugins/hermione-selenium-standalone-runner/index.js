const fs = require('fs');
const { spawn } = require('child_process');

// чтобы в windows заработало
const getCommandForPlatform = (command) => /^win/.test(process.platform) ? `${command}.cmd` : command;

module.exports = (hermione) => {
    let selenium;
    let app;

    hermione.on(hermione.events.RUNNER_START, async () => {
        const file = fs.openSync('selenium.log', 'w');

        const seleniumCommand = getCommandForPlatform('selenium-standalone');
        selenium = spawn(seleniumCommand, ['start'], {
            stdio: ['ignore', file, file]
        });

        selenium.on('error', (err) => {
            console.log('selenium: ' + err);
            selenium.kill();
        });

        const npmCommand = getCommandForPlatform('npm');
        app = spawn(npmCommand, ['run', 'start:ci']);

        app.on('error', (err) => {
            console.log('app: ' + err);
            app.kill();
        });

        await new Promise((res) => {
            setTimeout(() => {
                res();
            }, 20000);
        });
    });

    hermione.on(hermione.events.RUNNER_END, () => {
        return new Promise((resolve) => {
            selenium.on('exit', () => resolve());
            app.on('exit', () => resolve());

            selenium.kill();
            app.kill();
        });
    });
};
