const { days } = require('./constants');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const homedir = require('os').homedir();
const desktopDir = `${homedir}/Desktop`;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'test12home@gmail.com',
        pass: 'Developer1'
    }
})

module.exports.processData = function(payload) {
    const data = payload.days;
    const assignments = payload.assignments;
    const people = payload.people;

    const shifts = {};
    for(let key of Object.keys(assignments)) {
      let indexes = key.split('.');
      shifts[indexes[1]] = shifts[indexes[1]] || {};
      shifts[indexes[1]][indexes[3]] = shifts[indexes[1]][indexes[3]] || {};
      shifts[indexes[1]][indexes[3]][indexes[0]] = {name: assignments[key].name, showText: assignments[key].showText};
    }

    const wb = new ExcelJS.Workbook();
   wb.properties.date1904 = true;
   wb.calcProperties.fullCalcOnLoad = true;
   const ws = wb.addWorksheet("Responses")
   ws.columns = [
       {header: 'Sunday', key: 'sunday', width: 15},
       {header: 'Monday', key: 'monday', width: 15},
       {header: 'Tuesday', key: 'tuesday', width: 15},
       {header: 'Wednesday', key: 'wednesday', width: 15},
       {header: 'Thursday', key: 'thursday', width: 15},
       {header: 'Friday', key: 'friday', width: 15},
   ]
 
   const morningData = {};
   const noonData = {};
   const eveningData = {};
 
 Object.values(data).forEach((row, weekIdx) => {
    for (let i = 0; i < 6; i++) {
      shifts[weekIdx] = shifts[weekIdx] || {};
      shifts[weekIdx]['morning'] = shifts[weekIdx]['morning'] || {};
      shifts[weekIdx]['noon'] = shifts[weekIdx]['noon'] || {};
      shifts[weekIdx]['evening'] = shifts[weekIdx]['evening'] || {};
      row[days[i]] = {richText: [{text: row[days[i]] || ''}]};
      morningData[days[i]] = {richText: [{text: shifts[weekIdx]['morning'][days[i]]?.showText || '', name: shifts[weekIdx]['morning'][days[i]]?.name}]};
      noonData[days[i]] = {richText: [{text: shifts[weekIdx]['noon'][days[i]]?.showText || '', name: shifts[weekIdx]['noon'][days[i]]?.name}]};
      eveningData[days[i]] = {richText: [{text: shifts[weekIdx]['evening'][days[i]]?.showText || '', name: shifts[weekIdx]['evening'][days[i]]?.name}]};
    }
    const placeholderRow = {
        sunday: '',
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: ''
    }

    ws.addRow(row);
    ws.addRow(morningData);
    ws.addRow(noonData);
    ws.addRow(eveningData);
    ws.addRow(placeholderRow);
  });
    ws.eachRow(a => {
        a.alignment = {
            vertical: 'center',
            horizontal: 'center'
        }
        a.eachCell(cell => {
            if(cell.value.richText) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: people[cell.value.richText[0].name]?.color && people[cell.value.richText[0].name]?.color.substr(1,6)
                    }
                }
                if(cell._address.startsWith('F') && Number(cell._address.substr(1,cell._address.length-1)) % 5 === 0) {
                    cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: {
                        argb: '000000'
                      }
                    }
                  }
                cell.font = {
                    size: 15
                }
                cell.border = {
                    top: {style: 'thin'},
                    left: {style: 'thin'},
                    bottom: {style: 'thin'},
                    right: {style: 'thin'}
                }
            }
        })
    })
    // wb.xlsx.writeFile('/home/maks/Public/data.xlsx').then(async res => {
   wb.xlsx.writeFile(`${desktopDir}/data.xlsx`).then(async res => {
    transporter.sendMail({
        from: '"Schedule Sender" <test12home@gmail.com>',
        to: 'thalialya173@gmail.com',
        subject: 'סידור עבודה',
        text: "סידור עבודה מצורף",
        attachments: [
            {
                filename: 'schedule.xlsx',
                path: `${desktopDir}/data.xlsx`,
                cid: 'schedule' + Date.now()
            }
        ]

    })
   })

}