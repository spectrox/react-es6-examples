import React from 'react';

const ROWS = 15;
const COLS = 15;

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.getDefaultState();
    }

    render() {
        if (this.isGameFinished()) {
            return (
                <div>We have a winner!</div>
            );
        }

        if (this.isGameOver()) {
            return (
                <div>Game over! <a href="#" onClick={this.onStartNewGame.bind(this)}>Start new game</a></div>
            );
        }

        let rows = this.state.map.map((cols, rowIndex) => {
            return (
                <tr key={'row' + rowIndex}>
                    {
                        cols.map((field, colIndex) => {
                            return (
                                <td key={'row' + rowIndex + 'col' + colIndex}>
                                    { rowIndex == this.state.position.y &&
                                      colIndex == this.state.position.x ?
                                          '😀' : this.getEntryIcon(field.entry) }
                                </td>
                            );
                        })
                    }
                </tr>
            );
        });

        return (
            <div>
                <table>
                    <tbody>
                        {rows}
                        <tr>
                            <td colSpan="15">
                                <input autoFocus={true} type="text" onChange={this.onCommandChange.bind(this)}
                                    onKeyUp={this.onKeyUp.bind(this)}
                                    value={this.state.value}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    getDefaultState() {
        return {
            // FIXME: change property name to a better one
            map: this.generateMap(Math.floor(ROWS / 2), Math.floor(COLS / 2)),
            position: {
                x: Math.floor(COLS / 2),
                y: Math.floor(ROWS / 2)
            },
            value: '',
            history: [],
            historyPosition: null,
            gameOver: false,
            gameFinished: false
        };
    }

    generateMap(rowIndex, colIndex) {
        let map = [];

        for (let i = 0; i < ROWS; i++) {
            let row = [];

            for (let j = 0; j < COLS; j++) {
                row.push({
                    entry: i == rowIndex && j == colIndex ? 0 : this.getRandomEntry()
                });
            }

            map.push(row);
        }

        return map;
    }

    getRandomEntry() {
        return Math.floor(Math.random() * 2) ? Math.floor(Math.random() * 5) : 0;
    }

    getEntryIcon(entry) {
        switch (entry) {
            case 4:
                return '💩';
            case 3:
                return '😈';
            case 2:
                return '👹';
            case 1:
                return '👻';
            default:
                return '';
        }
    }

    onStartNewGame() {
        this.setState(this.getDefaultState());
    }

    onKeyUp(e) {
        if (e.keyCode == 27) { // esc
            this.setState({
                value: '',
                historyPosition: null
            });
        } else if (e.keyCode == 13) { // enter
            if (this.executeCommand(e.target.value)) {
                this.setState({
                    value: '',
                    historyPosition: null
                });
            } else {
                // show error
            }
        } else if (e.keyCode == 38) { // up arrow
            e.preventDefault();

            this.historyUp();
        } else if (e.keyCode == 40) { // down arrow
            e.preventDefault();

            this.historyDown();
        }
    }

    onCommandChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    executeCommand(command) {
        command = command.trim();

        if (command.indexOf(' ') !== -1) {
            let commands = command.split(' ');

            if (commands[0] == 'go') {
                if (!this.executeGoCommand(commands[1])) {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            switch (command) {
                case 'help':
                    alert("Usage: go <direction>\n" +
                        "Directions: left, right, up, top, down, bottom.");

                    break;
                default:
                    return false;
            }
        }

        this.addToHistory(command);

        return true;
    }

    executeGoCommand(direction) {
        let position = this.state.position;

        switch (direction) {
            case 'top':
            case 'up':
                if (position.y > 0) {
                    --position.y
                } else {
                    position.y = ROWS - 1;
                }
                break;
            case 'bottom':
            case 'down':
                if (position.y < ROWS - 1) {
                    ++position.y;
                } else {
                    position.y = 0;
                }
                break;
            case 'left':
                if (position.x > 0) {
                    --position.x;
                } else {
                    position.x = COLS - 1;
                }
                break;
            case 'right':
                if (position.x < COLS - 1) {
                    ++position.x;
                } else {
                    position.x = 0;
                }
                break;
            default:
                return false;
        }

        if (this.isDeadly(position.y, position.x)) {
            this.gameOver();
        } else {
            this.setState({
                position: position
            });
        }

        return true;
    }

    historyUp() {
        let historyPosition = this.state.historyPosition;

        if (historyPosition === null) {
            historyPosition = this.state.history.length - 1;
        } else {
            historyPosition = Math.max(0, historyPosition - 1);
        }

        this.setState({
            value: this.state.history[historyPosition],
            historyPosition: historyPosition
        });
    }

    historyDown() {
        let historyPosition = this.state.historyPosition;

        if (historyPosition === null) {
            return;
        }

        if (historyPosition >= this.state.history.length - 1) {
            historyPosition = null;
        } else {
            historyPosition++;
        }

        this.setState({
            value: historyPosition !== null ? this.state.history[historyPosition] : '',
            historyPosition: historyPosition
        });
    }

    addToHistory(command) {
        let history = this.state.history;

        history.push(command);

        this.setState({
            history: history
        });
    }

    isGameOver() {
        return this.state.gameOver;
    }

    gameOver() {
        this.setState({
            gameOver: true
        });
    }

    isGameFinished() {
        return this.state.gameFinished;
    }

    gameFinished() {
        this.setState({
            gameFinished: true
        });
    }

    isDeadly(rowIndex, colIndex) {
        return this.state.map[rowIndex][colIndex].entry > 0;
    }
}

export default Main;
