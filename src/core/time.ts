export type TimeDiff = {
    readonly days: number;
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
};

export function diffTime(from: Date, to: Date): TimeDiff {
    let diffSeconds = Math.floor((to.getTime() - from.getTime()) / 1000);

    const sign = diffSeconds < 0 ? -1 : 1;
    diffSeconds = Math.abs(diffSeconds);

    const days = Math.floor(diffSeconds / 86400);
    diffSeconds -= days * 86400;

    const hours = Math.floor(diffSeconds / 3600);
    diffSeconds -= hours * 3600;

    const minutes = Math.floor(diffSeconds / 60);
    diffSeconds -= minutes * 60;

    const seconds = diffSeconds;

    const applySign = (value: number, sign: number) => value === 0 ? 0 : value * sign;

    return {
        days: applySign(days, sign),
        hours: applySign(hours, sign),
        minutes: applySign(minutes, sign),
        seconds: applySign(seconds, sign),
    };
}
