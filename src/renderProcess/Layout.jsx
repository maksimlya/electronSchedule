import React, {Component} from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import './Layout.css';
import '../../node_modules/react-month-picker/css/month-picker.css';
import { Calendar } from './Calendar';
import { ColorPicker } from './ColorPicker.jsx';
import {MonthPicker} from './Picker';

const ResponsiveGridLayout = WidthProvider(Responsive);

export class CalendarLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layout: [],
            people: JSON.parse(localStorage.getItem('people')) || {},
            assignments: {},
            chosenColor: '#FFFFFE',
            nameText: '',
            commentText: '',
            selectedPerson: null,
            selectedMonth: null,
            selectedYear: null
        }
        this.nameInput = React.createRef();
        this.commentInput = React.createRef();
        this.selectedPerson = React.createRef();
    }

    addPerson = () => {
        const newPerson = {
            name: this.state.nameText,
            color: this.state.chosenColor
        }
        const people = this.state.people;
        people[newPerson.name] = newPerson;
        this.setState({people, nameText:'', chosenColor: '#FFFFFE'});
        localStorage.setItem('people', JSON.stringify(people));
    }

    calendarPickerCallback = res => {
        this.initCalendar(res.month, res.year);
    }

    initCalendar = (month, year) => {
        const data = new Calendar(month-1,year).getData();
        let x = 0;
        let y = 0;
        let layout = [];
        for(let week of Object.keys(data)) { 
            for(let day of Object.keys(data[week])) {
                layout.push({i: day + '.' + y + '.' + x, x, y, h:4, w:1, value: data[week][day], static:false});
                x++;
            }
            y++;
            x = 0;
        }

        const assignments = JSON.parse(localStorage.getItem('assignments.' + month + '.' + year)) || {};
        for(let [key, value] of Object.entries(assignments)) {
            if(!this.state.people[value.name]) {
                delete assignments[key];
            }
        }
        localStorage.setItem('assignments.' + month + '.' + year, JSON.stringify(assignments));
        
        this.setState({layout, assignments, selectedMonth: month, selectedYear: year});
        window.data = this;
    }

    componentDidMount = () => {
        this.initCalendar(new Date().getMonth() + 1, new Date().getFullYear());
    }
    
    removeAssignment = e => {
        if(e.target.innerText) {
            e.target.innerText = '';
            e.target.style.backgroundColor = '';
        }
        const assignments = this.state.assignments;
        delete assignments[e.target.id];
        localStorage.setItem('assignments.' + this.state.selectedMonth + '.' + this.state.selectedYear, JSON.stringify(assignments));
        this.setState({assignments: {...assignments}});
        e.preventDefault();
    }
    removePerson = e => {
        const people = this.state.people;
        const assignments = this.state.assignments;


        for(let [key, value] of Object.entries(assignments)) {
            if(e.target.innerText === value.name || e.target.innerText === value.showText) {
                delete assignments[key];
            }
        }
        delete people[e.target.innerText];
     

        localStorage.setItem('assignments.' + this.state.selectedMonth + '.' + this.state.selectedYear, JSON.stringify(assignments));
        localStorage.setItem('people', JSON.stringify(people));

        this.setState({people: {...people}, selectedPerson: null, assignments: {...assignments}});
        e.preventDefault();
    }

    onPersonSelect = e => {
        if(this.selectedPerson.current) {
            this.selectedPerson.current.id = '';
        }
        this.setState({selectedPerson: e.target.innerText === this.state.selectedPerson ? null : e.target.innerText});
        this.selectedPerson.current = e.target.parentNode;
        this.selectedPerson.current.id = 'selected';
    }

    onClick = e => {
        if(e.target.innerText) {
            e.target.innerText = '';
            e.target.style.backgroundColor = '';
        }
        if(this.state.selectedPerson) {
            e.target.style.backgroundColor = this.state.people[this.state.selectedPerson].color;
            e.target.innerText = this.state.selectedPerson + ' ' + this.state.commentText;
            const assignments = this.state.assignments;
            assignments[e.target.id] = {name: this.state.selectedPerson, showText: this.state.selectedPerson + ' ' + this.state.commentText};
            localStorage.setItem('assignments.' + this.state.selectedMonth + '.' + this.state.selectedYear, JSON.stringify(assignments));
            this.setState({assignments: {...assignments}});
        }
    }
    
    handleColorChange = color => {
        this.setState({chosenColor: color.hex});
    }

    updateText = e => {
        this.setState({nameText: e.target.value});
    }
    updateComment = e => {
        this.setState({commentText: e.target.value});
    }

    preparePayload = () => {
        const data = [];
        let i = 0;
        let weekData = {}
        for(let inst of this.state.layout)  {
            if( i >= 6) {
                i = 0;
                weekData = {};
            }
            weekData[inst.i.split('.')[0]] = inst.value;  
            i++;
            if(i>=6) {
                data.push(weekData);
            }
        }
        return data;
    }

    handleWipeData = () => {
        localStorage.clear();
        ipcRenderer.send('restart');
    }

    handleSubmit = () => {
        const data = this.preparePayload();
        ipcRenderer.send('dataready', {days: data, people: this.state.people, assignments: this.state.assignments});
    }

    render() {
        return(
            <div className="container">
            <ResponsiveGridLayout 
                className="layout" 
                layouts={{lg:this.state.layout, md: this.state.layout}} 
                isDraggable={false}
                isResizable={false}
                isRearrangeable={false}
                compactType={null}
                breakpoints={{lg:1200,md:996}}
                cols={{lg:8,md:8,sm:8}} 
                rowHeight={20}
                width={750}>
                {this.state.layout.map(a => {
                    return(
                        <div key={a.i} id={a.i} className="myk">
                            <div className='myi'>{a.value}</div>
                            <div className='myj' id={a.i+'.morning'} onClick={this.onClick} onContextMenu={this.removeAssignment} style={{backgroundColor: this.state.people[this.state.assignments[a.i+'.morning']?.name]?.color}}>{this.state.people[this.state.assignments[a.i+'.morning']?.name] ? this.state.assignments[a.i+'.morning']?.showText : ''}</div>
                            <div className='myj' id={a.i+'.noon'} onClick={this.onClick} onContextMenu={this.removeAssignment} style={{backgroundColor: this.state.people[this.state.assignments[a.i+'.noon']?.name]?.color}}>{this.state.people[this.state.assignments[a.i+'.noon']?.name] ? this.state.assignments[a.i+'.noon']?.showText : ''}</div>
                            <div className='myj' id={a.i+'.evening'} onClick={a.i.split('.')[2] === '5' ? null : this.onClick} onContextMenu={this.removeAssignment} style={{backgroundColor: a.i.split('.')[2] === '5' ? '#000000' : this.state.people[this.state.assignments[a.i+'.evening']?.name]?.color}}>{this.state.people[this.state.assignments[a.i+'.evening']?.name] ? this.state.assignments[a.i+'.evening']?.showText : ''}</div>
                        </div>
                    );
                })} 

                <div key="picker" className="picker" data-grid={{x:6,y:0,h:1,w:1}}><MonthPicker callback = {this.calendarPickerCallback}/></div>
                <div key="nameInput" className="nameContainer" data-grid={{x:6,y:1,h:1,w:2}}>
                    <input ref={this.nameInput} onChange={this.updateText} value={this.state.nameText} className="nameInput" type="text"/>
                    <ColorPicker chosenColor={this.state.chosenColor} handleColorChange = {this.handleColorChange}/>
                </div>
                <div key="commentInput" className="commentContainer" data-grid={{x:6,y:3,h:1,w:2}}>
                    <input placeholder="Comment here...." ref={this.commentInput} onChange={this.updateComment} value={this.state.commentText} className="commentInput" type="text"/>
                </div>
                <div key="nameField" data-grid={{x:6,y:2,h:1,w:1}}><button disabled={!this.state.nameText || this.state.chosenColor === '#FFFFFE'} className="nameField" onClick={this.addPerson}>Add New</button></div>
               
                {Object.values(this.state.people).map(a =>
                    <div key={a.name} className="people" data-grid={{x:6, y:4,h:2,w:1}}>
                    <div className="content" onContextMenu={this.removePerson} onClick={this.onPersonSelect} style={{"backgroundColor":a.color}} >{a.name}</div>
                    </div>
                )}
                <div key="sendButton" className="sendButton" data-grid={{x:6,y: Math.max(Object.values(this.state.people).length*2+1, 6),h:1,w:1}}><button onClick={this.handleSubmit}>Submit</button></div>
                <div key="wipeData" className="wipeData" data-grid={{x:10,y:20,h:1,w:1}}><button onClick={this.handleWipeData}>Wipe Data</button></div>
            </ResponsiveGridLayout>
        </div>
        )
    }
}