class RoundConfiguration
{
    constructor(gridHeigth, gridWidth, mineCount, timeToEnd)
    {
        this.gridHeigth = gridHeigth;
        this.gridWidth = gridWidth;
        this.mineCount = mineCount;
        this.randomMines = [];
        this.timeToEnd = timeToEnd;
    }
}

module.exports = RoundConfiguration;