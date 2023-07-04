const format_plural = (word, amount) => (amount !== 1) ? `${word}s` : word;

const format_date = (date) => {
    const formattedDate = new Date(date);
    const month = formattedDate.getMonth() + 1;
    const day = formattedDate.getDate();
    const year = formattedDate.getFullYear();
    return `${month}/${day}/${year}`;
};

module.exports = {
    format_plural,
    format_date
};
