const addMinute = (date: Date, minutes: number): Date => {
    return new Date(date.getTime() + minutes * 60000);
};

export { addMinute };
