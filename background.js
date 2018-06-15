const setAlarm = request => {
    switch (request.action){

        case 'create':
            const when = request.when
            const id = request.id
            const gettingItem = browser.storage.local.get('tslAlarms');
            gettingItem.then((res) => {
                if (request.action === 'create'){
                    const newAlarms = res.tslAlarms
                    newAlarms[request.id] = request.alarm
                    browser.storage.local.set({ tslAlarms: newAlarms })
                    createAlarm(when, id)
                }
            }).catch(()=>{
                browser.storage.local.set({ tslAlarms: { [id] :  request.alarm } })
                if (request.action === 'create'){
                    createAlarm(when, id)
                }
            })
        break;
        case 'delete':
            browser.alarms.clear(request.id)
        break;
        default:
        break;
    }
}

const createAlarm = (when, id) => {
    browser.alarms.create(
        id,
        {when}
    )
}

//Function for background music when message pops up
function playAudio(){
  var audio=new Audio('Ring.mp3');
  setTimeout(audio.play(),1);
}

browser.runtime.onMessage.addListener(setAlarm);

browser.alarms.onAlarm.addListener((alarm) => {
//Add function for background music
    playAudio();
    const gettingItem = browser.storage.local.get('tslAlarms');
    gettingItem.then((res) => {
        browser.notifications.create( {
            "type": "basic",
            "iconUrl": "icons/logo_64.png",
            "title": "Alarm",
            "message": res.tslAlarms[alarm.name] || 'Firefox Alarm'
        });
        const alarms = res.tslAlarms
        delete alarms[alarm.name]
        browser.storage.local.set({ tslAlarms: alarms })
    })

});
