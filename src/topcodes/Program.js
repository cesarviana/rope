export default class Program
{
    constructor(instructionsString)
    {
        this.EXECUTE_CHAR = 'e';
        this.CLEAR_CHAR   = 'c';
        this.instructionsString = instructionsString;
    }

    mustExecute()
    {
        return this.instructionsString.includes(this.EXECUTE_CHAR);
    }

    build()
    {
        return this.CLEAR_CHAR + this._instructionsWithoutExecute() + this.EXECUTE_CHAR;
    }

    _instructionsWithoutExecute()
    {
        return this.instructionsString.replace(this.EXECUTE_CHAR, '');
    }
}