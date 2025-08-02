function ctx(ctx) {
    if (typeof ctx !== 'string') return null;

    const units = {
        ms: 1,
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000
    };

    const regex = /^(\d{0,1})(ms|s|m|h|d)$/;
    const match = ctx.match(regex);
    if (!match) return null;

    const num = match[1] ? parseInt(match[1]) : 1;
    const unit = match[2];

    return num * units[unit];
}

module.exports = ctx;