import React, {Component} from 'react';
import { SketchPicker } from 'react-color';

export class ColorPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false
        }
        this.modalNode = React.createRef();
    }

    componentDidMount() {
        document.addEventListener("click", this.handleOutsideClick);
    }

    handleOutsideClick = e => {
        if(!this.modalNode?.current?.contains(e.target)) {
            this.handleClose();
        }
        e.stopPropagation();
    }

    handleClick = () => {
        if(this.state.displayColorPicker) {
            this.setState({displayColorPicker: false});
        } else {
            setTimeout(() => {
                this.setState({displayColorPicker: !this.state.displayColorPicker});
            },100)
        }
    }
    handleClose = () => {
        this.setState({displayColorPicker: false});
    }

    render() {
      
        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px'
        }
        return (
            <span>
                <span className="nameColor" style={{"backgroundColor":this.props.chosenColor}} onClick={this.handleClick}>Color</span>
                {this.state.displayColorPicker ? <div className="popover">
                    <div style={cover} onClick={this.handleClose}/>
                    <div  ref={this.modalNode}><SketchPicker
                    color={this.props.chosenColor}
                    onChange={this.props.handleColorChange}
                    onChangeComplete={this.props.handleColorChange}/></div>
                    </div> : null}
            </span>
        )
    }

}