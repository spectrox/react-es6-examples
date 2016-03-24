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

        let rows = Object.keys(this.state.map).map((rowIndex) => {
            let cols = this.state.map[rowIndex];

            return (
                <tr key={'row' + rowIndex}>
                    {
                        Object.keys(cols).map((colIndex) => {
                            let field = cols[colIndex];

                            return (
                                <td key={'col' + colIndex}
                                    onClick={this.onClick.bind(this, rowIndex, colIndex)}
                                    style={this.getFieldStyle(field)}>
                                    { rowIndex == this.state.position.y &&
                                      colIndex == this.state.position.x ?
                                          '😀' : '+' }
                                </td>
                            );
                        })
                    }
                </tr>
            );
        });

        return (
            <table>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }

    getFieldStyle(field) {
        if (field.opened) {
            if (field.flag) {
                return {
                    background: 'red',
                    color: 'white'
                };
            } else {
                return {
                    background: 'green',
                    color: 'white'
                };
            }
        }

        return {};
    }

    getDefaultState() {
        return {
            map: this.generateMap(),
            position: {
                x: Math.floor(COLS / 2),
                y: Math.floor(ROWS / 2)
            },
            gameOver: false,
            gameFinished: false
        };
    }

    generateMap() {
        let map = {};

        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                if (map[i] === undefined) {
                    map[i] = {};
                }

                map[i][j] = {
                    flag: !Math.floor(Math.random() * 3),
                    opened: false
                };
            }
        }

        return map;
    }

    onStartNewGame() {
        this.setState(this.getDefaultState());
    }

    onClick(rowIndex, colIndex, e) {
        e.preventDefault();

        rowIndex = parseInt(rowIndex);
        colIndex = parseInt(colIndex);

        if (this.isOpened(rowIndex, colIndex)) {
            return;
        }

        if (this.isDeadly(rowIndex, colIndex)) {
            this.gameOver();

            return;
        }

        this.open(rowIndex, colIndex);

        if (!this.hasNotOpened()) {
            this.gameFinished();
        }
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

    hasNotOpened() {
        let hasNotOpened = false;

        Object.keys(this.state.map).forEach(rowIndex => {
            Object.keys(this.state.map[rowIndex]).forEach(colIndex => {
                if (!this.state.map[rowIndex][colIndex].opened &&
                    !this.state.map[rowIndex][colIndex].flag
                ) {
                    hasNotOpened = true;
                }
            });
        });

        return hasNotOpened;
    }

    isOpened(rowIndex, colIndex) {
        return this.state.map[rowIndex][colIndex].opened;
    }

    isDeadly(rowIndex, colIndex) {
        return this.state.map[rowIndex][colIndex].flag;
    }

    open(rowIndex, colIndex) {
        let map = this.state.map;

        map[rowIndex][colIndex].opened = true;

        this.setState({
            map: map
        });
    }
}

export default Main;
