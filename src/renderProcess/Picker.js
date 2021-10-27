import React, {Component} from 'react';
import Picker from 'react-month-picker';

class MonthBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            value: this.props.value || 'N/A'
        }
    }

    static getDerivedStateFromProps(props, state) {
        return {
            value: props.value || 'N/A'
        }
    }

    render() {
        return (
            <div className="box" onClick={this._handleClick}>
                {this.state.value}
            </div>
        )
    }
    _handleClick = e => {
        this.props.onClick?.(e);
    }
}

export class MonthPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            singleValue: {year: new Date().getFullYear(), month: new Date().getMonth() + 1},
            modalOpen: false
        }
        this.pickAMonth = React.createRef();
        this.modalNode = React.createRef();
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClick);
    }

    onClick = () => {
        setTimeout(() => {
            this.setState({modalOpen: true});
        }, 100);
        this.pickAMonth.current.show();
    }

    handleMonthChange = (err, res) => {

    };
    handleMonthDismiss = value => {
        this.setState({singleValue: value})
        this.props.callback(value);
    }

    handleClick = e => {
        if(!this.modalNode.current?.contains(e.target)) {
            if(this.state.modalOpen) {
                this.pickAMonth.current?.dismiss();
                this.setState({modalOpen: false});
            }
        }
        e.stopPropagation();
    }

    render() {
        const pickerLang = {
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
        const {singleValue} = this.state;

        const makeText = m => {
            if(m?.year && m?.month) {
                return pickerLang.months[m.month-1] + ' ' + m.year;
            }
            return '?';
        }
        return(           
                <div className="edit" ref={this.modalNode}>
                    <Picker
                    ref={this.pickAMonth}
                    years={{min:{year:new Date().getFullYear()-1, month: new Date().getMonth() + 1}, max: {year: new Date().getFullYear() + 2, month:new Date().getMonth() + 1}}}
                    value={singleValue}
                    lang={pickerLang.months}
                    theme="dark"
                    onChange={this.handleMonthChange}
                    onDismiss={this.handleMonthDismiss}
                    >
                        <MonthBox value={makeText(singleValue)} onClick={this.onClick}/>
                    </Picker>
                </div>)
    }
}