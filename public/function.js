const $ = id => document.getElementById(id);
const fd = (e,f) => document.getElementById(e).innerHTML = f;
const cg = (e,f) => document.getElementById(e).classList.toggle(f);
const cr = (e,f) => document.getElementById(e).classList.remove(f);
const ca = (e,f) => document.getElementById(e).classList.add(f);
const cl = (id, handler) => $(id).addEventListener('click', handler);

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];


function dtClr(dt) {
    let cln = dt.replace(/^'/, '');
    return cln
};
function dtISO(dt) {
    let nd = new Date(dt);
    let res = nd.toISOString();
    return res;
};
function dtEpo(dt){
    let res = Math.floor(new Date(dt).getTime() / 1000);
    return res;
};



// Sorter Function
async function doSorter(db0){
    let srt = $('slSrt').value;
    let db1 = [];
    if(srt === 'tgDes'){
        db1 = db0.sort((a, b) => b.taEpo - a.taEpo); // descending order
    } else if(srt === 'tgAsc'){
        db1 = db0.sort((a, b) => a.taEpo - b.taEpo); // ascending order
    };
    $('fullData').innerHTML = '';
    showDt(db1);
};

// Filter Function
async function doFilter(){
    let db0 = JSON.parse(localStorage.getItem('monKontrakDB'));
    let str = $('kdStr').value;
    let sts = $('slSts').value;
    let db1 = [];
    let db2 = [];

    if(str){
        for (let i = 0; i < db0.length; i++) {
            if(db0[i].KdSat == str){
                db1.push(db0[i]);
            };
        };
    } else {
        db1 = db0;
    };

    if(sts){
        for (let i = 0; i < db1.length; i++) {
            if(db1[i].kStts == sts){
                db2.push(db1[i]);
            };
        };
    } else {
        db2 = db1;
    };
    $('fullData').innerHTML='';
    doSorter(db2);
};

// Show Data in Table
async function showDt(db){
    for (let i = 0; i < db.length; i++) {
        let ntr = document.createElement('tr');
        ntr.innerHTML = `
        <td>${i+1}</td>
        <td>${db[i].KdSat}</td>
        <td class='bw'>${db[i].NoKon}</td>
        <td class='tr'>${db[i].nKtrk.toLocaleString()}</td>
        <td class='tr'>${db[i].nReal.toLocaleString()}</td>
        <td class='tr'>${db[i].nSisa.toLocaleString()}</td>
        <td>${db[i].tAkhr}</td>
        <td>${db[i].kStts}</td>
        `;
        $('fullData').appendChild(ntr);
    };
};




async function xl2tbl(data) {
    const db = [];
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        let KdSat = data[i].Satker;
        let NoKon = data[i].Nomor;
        let nKtrk = data[i]['Nilai Kontrak'];
        let nReal = data[i]['Nilai Realisasi'];
        let nSisa = data[i]['Nilai Sisa'];
        let kStts = (nSisa === 0) ? 'Selesai' : 'Berjalan';
        let tAkhr = dtClr(data[i]['Tgl Akhir']);
        let taISO = dtISO(tAkhr);
        let taEpo = dtEpo(tAkhr);
        console.log(tAkhr, taISO, taEpo)
        let nData = {KdSat, NoKon, nKtrk, nReal, nSisa, tAkhr, taISO, taEpo, kStts};
        db.push(nData);
    };
    localStorage.setItem('monKontrakDB', JSON.stringify(db));
    console.log('clean result:');
    console.log(db);
    showDt(db);
};
function xl2Json(file) {
    const reader = new FileReader();
    reader.onload = e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const result = {};
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa.length > 0) {
                result['data'] = roa;
            }
        });
        console.log('raw result:');
        console.log(result);
        xl2tbl(result.data)
    };
    reader.readAsArrayBuffer(file);
};
function uploadFile(fr) {
    const file = document.getElementById(fr).files[0];
    if (!file) return alert("Pilih file yang sesuai...");

    const ext = file.name.split('.').pop().toUpperCase();
    if (['XLS', 'XLSX'].includes(ext)) {
        xl2Json(file);
    } else {
        alert("Please select a valid excel file.");
    }
};

cl('upBtn', () => {uploadFile('upFile')});
cl('flBtn', () => {doFilter()});