export const parseDurationToMs = (value: string, fallbackMs: number): number => {
    const trimmedValue = value.trim();
    const match = trimmedValue.match(/^(\d+)([smhd])$/i);

    if (!match) {
        const numeric = Number(trimmedValue);
        return Number.isFinite(numeric) && numeric > 0 ? numeric : fallbackMs;
    }

    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();

    const unitMap: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    const multiplier = unitMap[unit];
    return amount > 0 && multiplier ? amount * multiplier : fallbackMs;
};
