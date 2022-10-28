export const thousand = value => {
    if (typeof value === "number") {
        value = String(Math.ceil(value * 100) / 100)
    }
    console.log("value Number", value);
    value = value.replace(/\s/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return value;
}
