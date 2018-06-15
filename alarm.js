const config = {
    target:     'start-date-mtr-datepicker',
    timestamp:  new Date,
    future:     true,
    months: {
      min: 0,
      max: 11,
      step: 1
    },
    minutes: {
      min: 0,
      max: 59,
      step: 1
    },
    years: {
      min: 2017,
      max: 2038,
      step: 1
    }
  };

const domElements = {
  saveAlarm: document.getElementById('saveAlarm'),
  alarmText: document.getElementById('alarm-text'),
  showAlarms: document.getElementById('showAlarms'),
  showClock: document.getElementById('showClock'),
  aClock: document.getElementById('aClock'),
  isList: document.getElementById('isList'),
  alarmHolder: document.getElementById('alarmHolder'),
	alarmPlaceholder: document.getElementById('alarmPlaceholder'),
	success: document.getElementById('success')
}
const myDatepicker = new MtrDatepicker(config);

domElements.saveAlarm.addEventListener('click', ()=>{

    const when = myDatepicker.getTimestamp()
    const sending = browser.runtime.sendMessage({
        action: "create",
        alarm: domElements.alarmText.value,
        id: 'queIt_'+when,
        when
    });
    domElements.alarmText.value = '';
		domElements.success.className = 'showMe'
		setTimeout(()=>{domElements.success.className = ''},1000)
})
domElements.showAlarms.addEventListener('click', ()=>{
  domElements.aClock.className = 'hide'
  domElements.isList.className = ''
  setList()
})

domElements.showClock.addEventListener('click', ()=>{
  domElements.aClock.className = ''
  domElements.isList.className = 'hide'
})

const setList = () => {
  while (domElements.alarmHolder.firstChild) {
    domElements.alarmHolder.removeChild(domElements.alarmHolder.firstChild);
  }
  const gettingItem = browser.storage.local.get('tslAlarms');
  gettingItem.then((res) => setAlarmList(res))
}
const setAlarmList = response => {
  const tslAlarms = response.tslAlarms
  if(!tslAlarms)
    return false

  if(Object.keys(tslAlarms).length === 0 && tslAlarms.constructor === Object) {
    domElements.AlarmPlaceholder.className = ''
  }else{
    domElements.alarmPlaceholder.className = 'hide'
    for(let item in  tslAlarms) {
      const localTime = parseInt(item.split('_')[1])
      const alarm = document.createElement('div')
      const alarmArrow = document.createElement('span')
      const alarmText = document.createElement('span')
      const alarmDelete = document.createElement('a')
      alarm.className = 'alarm'
      alarm.setAttribute('title', new Date(localTime))
      alarmArrow.textContent = '»'
      alarmText.textContent = tslAlarms[item]
      alarmDelete.textContent = '✖'
      alarmDelete.addEventListener('click',() => removeAlarm(item,alarm, tslAlarms))
      alarm.appendChild(alarmArrow)
      alarm.appendChild(alarmText)
      alarm.appendChild(alarmDelete)
      domElements.alarmHolder.appendChild(alarm)
    }
  }
}

const removeAlarm = (item, alarm, tslAlarms) => {

  domElements.alarmHolder.removeChild(alarm)
  delete tslAlarms[item]
  if(Object.keys(tslAlarms).length === 0 && tslAlarms.constructor === Object)
    domElements.alarmPlaceholder.className = ''
  browser.storage.local.set({ tslAlarms })
  const sending = browser.runtime.sendMessage({
    action: "delete",
    id: item
  });
}
