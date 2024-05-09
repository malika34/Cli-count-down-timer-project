#!/usr/bin/env node

// Import necessary modules
import inquirer from 'inquirer';
import chalk from 'chalk';

// Function to calculate time difference
function getTimeDifference(targetDate: Date): number {
    const now = new Date();
    return targetDate.getTime() - now.getTime();
}

// Function to format time
function formatTime(ms: number): string {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

// Function to pad zero
function padZero(num: number): string {
    return num < 10 ? '0' + num : '' + num;
}

// Function to print the clock
function printClock() {
    const date = new Date();
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    console.log(chalk.blue.bold(`
     ┌─────────┐
     │ ${chalk.yellowBright(hours)}:${chalk.greenBright(minutes)}:${chalk.cyanBright(seconds)} │
     └─────────┘
    `));
}

// Main function to start the timer
async function main() {
    console.log(chalk.blue.bold("╔════════════════════════╗"));
    console.log(chalk.blue.bold("║Welcome to Countdown   ║"));
    console.log(chalk.blue.bold("║          Timer          ║"));
    console.log(chalk.blue.bold("╚════════════════════════╝\n"));

    printClock();

    // Prompt user to enter the target date and time
    const { year, month, day, hour, minute, second } = await inquirer.prompt([
        {
            type: 'input',
            name: 'year',
            message: 'Enter the target year (YYYY):',
            validate: (value) => /^\d{4}$/.test(value) ? true : 'Please enter a valid year (YYYY).'
        },
        {
            type: 'input',
            name: 'month',
            message: 'Enter the target month (MM):',
            validate: (value) => /^(0?[1-9]|1[0-2])$/.test(value) ? true : 'Please enter a valid month (MM).'
        },
        {
            type: 'input',
            name: 'day',
            message: 'Enter the target day (DD):',
            validate: (value) => /^(0?[1-9]|[12]\d|3[01])$/.test(value) ? true : 'Please enter a valid day (DD).'
        },
        {
            type: 'input',
            name: 'hour',
            message: 'Enter the target hour (24-hour format HH):',
            validate: (value) => /^(0?\d|1\d|2[0-3])$/.test(value) ? true : 'Please enter a valid hour (HH).'
        },
        {
            type: 'input',
            name: 'minute',
            message: 'Enter the target minute (MM):',
            validate: (value) => /^[0-5]?\d$/.test(value) ? true : 'Please enter a valid minute (MM).'
        },
        {
            type: 'input',
            name: 'second',
            message: 'Enter the target second (SS):',
            validate: (value) => /^[0-5]?\d$/.test(value) ? true : 'Please enter a valid second (SS).'
        }
    ]);

    // Convert user input to a Date object
    const targetDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    const timeDifference = getTimeDifference(targetDate);

    // Check if the target time has already passed
    if (timeDifference < 0) {
        console.log(chalk.red.bold("\nThe target time has already passed!"));
    } else {
        console.log(chalk.green.bold("\nCountdown to the target time:"));

        // Start countdown
        const interval = setInterval(() => {
            const remainingTime = getTimeDifference(targetDate);
            if (remainingTime <= 0) {
                clearInterval(interval);
                process.stdout.write("\r" + chalk.yellow.bold("Countdown finished!"));
                console.log("\n");
                printClock();
            } else {
                process.stdout.write("\r" + chalk.yellow.bold(formatTime(remainingTime)));
            }
        }, 1000);
    }
}

// Call the main function
main();
