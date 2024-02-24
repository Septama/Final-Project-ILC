const bookShelf = [];
const tagShelf = () => {
    document.getElementById('tagBookshelf').innerHTML =
    `
    <button id="Selesai" class='tagButton m-1 w-1/2 text-center text-3xl md:text-2xl font-bold cursor-pointer '>Selesai dibaca</button>
    <button id="Belum" class='tagButton m-1 w-1/2 text-center text-3xl md:text-2xl font-bold cursor-pointer '>Belum selesai</button>`

    const tagButtons = document.querySelectorAll('.tagButton');
    const handleButtonClick = function() {
        const clickedButton = this;
        tagButtons.forEach(btn => {
            btn.classList.remove('text-white', 'border-2', 'rounded-xl', 'border-purple-700', 'bg-purple-400');
        });
        clickedButton.classList.add('text-white', 'border-2', 'rounded-xl', 'border-purple-700', 'bg-purple-400');
        updateUI(bookShelf, clickedButton.id === 'Selesai');
    };

    tagButtons.forEach(button => {
        button.removeEventListener('click', handleButtonClick);
        button.addEventListener('click', handleButtonClick); 
    });
    if (tagButtons.length > 0) {
        const firstButton = tagButtons[0];
        firstButton.classList.add('text-white', 'border-2', 'rounded-xl', 'border-purple-700', 'bg-purple-400');
    }
}
const form = document.getElementById('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const result = simpanBuku();
    if(result.status === 'success'){
        const selesai = document.querySelector('.tagButton.bg-purple-400').id === 'Selesai';
        updateUI(bookShelf, selesai)
    }
});
const simpanBuku = () => {
    const judul = form.judul.value;
    const penulis = form.penulis.value;
    const tahun = form.tahun.value;
    const id = bookShelf.length+1;
    const cekJudul = bookShelf.find(book => book.judul === judul);
    
    if(cekJudul){
        return alert(`Buku dengan judul ${judul} sudah ada di bookshelf`);
    }
    if(!judul || judul === ''){
        return {
            status: 'fail',
            message: "Gagal menambahkan buku. Mohon isi judul buku",
        };
    }

    const selesai = (form.cekBuku.checked);
    const newBook = {id, judul, penulis, tahun, selesai};
    bookShelf.push(newBook);
    return {
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: ({
            bookId: id,
        }),
    };
};

const deleteBuku = (id) => {
    const index = bookShelf.findIndex(note => note.id ===  id);
    bookShelf.splice(index, 1);
    return {
        status: 'success',
        message: 'Buku berhasil dihapus',
    }
}

function updateUI(buku, selesai) {
    const bukuContainer = document.getElementById('buku-container');
    bukuContainer.innerHTML = '';
    const filteredData = buku.filter(item => item.selesai === selesai);
    filteredData.forEach(m => {
        const bukuElement = showBuku(m);
        bukuContainer.appendChild(bukuElement)
    });
}

const showBuku = (m) => {
    const liElement = document.createElement('li');
    liElement.className = 'h-1/5 w-full flex justify-between border-b-2 text-white';
    liElement.innerHTML = `
    <div class="pl-2 w-1/3">
        <h1 class="mt-2 text-xl md:text-lg lg:text-xl font-bold">${m.judul}</h1>
        <h1 class="text-sm md:text-xs lg:text-sm">Penulis: ${m.penulis}</h1>
        <h1 class="text-sm md:text-xs lg:text-sm">Tahun: ${m.tahun}</h1>
        <h1 class="text-sm md:text-xs lg:text-sm">Id: ${m.id}</h1>
    </div>
    <div class="pl-6 flex flex-col">
        <button type="submit" class="pindah m-2 pl-${m.selesai ? 4 : '12'} pr-${m.selesai ? '4' : '12'} rounded-md bg-green-500 hover:bg-green-600 text-white text-xl">${m.selesai ? 'Belum selesai' : 'Selesai'}</button>
        <button type="submit" class="hapus m-2 rounded-md bg-red-500 hover:bg-red-700 text-white text-xl">Hapus</button>
    </div>`;

    liElement.querySelector('.pindah').addEventListener('click', () => {
        m.selesai = !m.selesai;
        updateUI(bookShelf, document.getElementById('Selesai').classList.contains('bg-purple-400'));
    });
    liElement.querySelector('.hapus').addEventListener('click', () => {
        deleteBuku(m.id);
        liElement.remove();
    });
    return liElement;
}
tagShelf()