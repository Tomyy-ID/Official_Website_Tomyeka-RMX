const $ = id => document.getElementById(id);
const client = window.getSupabaseClient?.();
let records = [];
function message(id, text, good=false){ const el=$(id); if(el){el.textContent=text;el.style.color=good?'#83edbd':'#ffca8a';} }
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function configured(){return !!client;}
async function requireAdmin(){
 if(!configured()){ $('loginMessage').textContent='Isi SUPABASE_URL dan SUPABASE_ANON_KEY di FLM/config.js terlebih dahulu.'; return false; }
 const {data:{session}}=await client.auth.getSession();
 if(!session){$('loginView').hidden=false;$('appView').hidden=true;return false;}
 const {data,isError,error}=await client.rpc('is_admin');
 if(error || data!==true){await client.auth.signOut();$('loginView').hidden=false;$('appView').hidden=true;message('loginMessage','Akun ini belum terdaftar sebagai admin. Tambahkan UUID akun ke tabel admin_users melalui SQL Editor.');return false;}
 $('loginView').hidden=true;$('appView').hidden=false;await loadRecords();return true;
}
async function loadRecords(){
 const {data,error}=await client.from('projects').select('*').order('sort_order',{ascending:false});
 if(error){message('formMessage','Gagal membaca database: '+error.message);return;}
 records=data||[]; $('totalCount').textContent=records.length;
 $('publishedCount').textContent=records.filter(x=>x.published).length;
 $('draftCount').textContent=records.filter(x=>!x.published).length;
 renderList();
}
function renderList(){
 const list=$('projectList');
 if(!records.length){list.innerHTML='<p class="empty">Belum ada project. Tambahkan project dari formulir.</p>';return;}
 list.innerHTML=records.map(p=>`<article class="project-item"><strong>${escapeHtml(p.title)} <span class="status ${p.published?'':'draft'}">${p.published?'Publik':'Draft'}</span></strong><div class="project-meta">ID: ${escapeHtml(p.id)} · ${escapeHtml(p.type||'ZIP')} · ${escapeHtml(p.size||'-')}</div><div class="actions"><button class="ghost small" data-edit="${escapeHtml(p.id)}">Edit</button><button class="ghost small delete" data-delete="${escapeHtml(p.id)}">Hapus</button>${p.drive_url?`<a class="ghost small" href="${escapeHtml(p.drive_url)}" target="_blank" rel="noopener">Cek Drive</a>`:''}</div></article>`).join('');
 list.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>editRecord(b.dataset.edit)));
 list.querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',()=>deleteRecord(b.dataset.delete)));
}
function editRecord(id){
 const p=records.find(x=>String(x.id)===String(id));if(!p)return;
 $('projectId').value=p.id;$('title').value=p.title||'';$('info').value=p.info||'';$('type').value=p.type||'ZIP';$('size').value=p.size||'';$('date').value=p.date||'';$('videoid').value=p.videoid||'';$('drive_url').value=p.drive_url||'';$('safelink_url').value=p.safelink_url||p.link||'';$('thumbnail_url').value=p.thumbnail_url||'';$('published').checked=!!p.published;$('formHeading').textContent='Edit project';$('saveBtn').textContent='Simpan perubahan';window.scrollTo({top:0,behavior:'smooth'});
}
function resetForm(){ $('projectForm').reset();$('projectId').value='';$('published').checked=true;$('type').value='ZIP';$('formHeading').textContent='Tambah project';$('saveBtn').textContent='Simpan project';message('formMessage',''); }
async function saveRecord(e){
 e.preventDefault();
 const id=$('projectId').value || (crypto.randomUUID?crypto.randomUUID():String(Date.now()));
 const payload={id,title:$('title').value.trim(),info:$('info').value.trim(),type:$('type').value.trim()||'ZIP',size:$('size').value.trim(),date:$('date').value.trim(),videoid:$('videoid').value.trim(),drive_url:$('drive_url').value.trim()||null,safelink_url:$('safelink_url').value.trim(),thumbnail_url:$('thumbnail_url').value.trim()||null,published:$('published').checked,sort_order:Date.now(),updated_at:new Date().toISOString()};
 if(payload.drive_url && !/^https:\/\/(drive\.google\.com|docs\.google\.com)\//i.test(payload.drive_url)){message('formMessage','Link Drive harus berasal dari drive.google.com atau docs.google.com.');return;}
 if(!/^https:\/\/(www\.)?sub4unlock\.(co|com)\//i.test(payload.safelink_url)){message('formMessage','Masukkan URL Sub4Unlock yang valid.');return;}
 $('saveBtn').disabled=true;message('formMessage','Menyimpan...');
 const {error}=await client.from('projects').upsert(payload,{onConflict:'id'});
 $('saveBtn').disabled=false;
 if(error){message('formMessage','Gagal menyimpan: '+error.message);return;}
 message('formMessage','Project berhasil disimpan.',true);resetForm();await loadRecords();
}
async function deleteRecord(id){
 const p=records.find(x=>String(x.id)===String(id));if(!p||!confirm(`Hapus project "${p.title}" dari database?`))return;
 const {error}=await client.from('projects').delete().eq('id',id);
 if(error){alert('Gagal menghapus: '+error.message);return;}await loadRecords();
}
$('loginForm').addEventListener('submit',async e=>{e.preventDefault();if(!configured()){message('loginMessage','Isi konfigurasi Supabase terlebih dahulu.');return;}message('loginMessage','Memeriksa akun...');const {error}=await client.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});if(error){message('loginMessage','Login gagal: '+error.message);return;}await requireAdmin();});
$('logoutBtn').addEventListener('click',async()=>{await client.auth.signOut();location.reload();});
$('projectForm').addEventListener('submit',saveRecord);$('resetBtn').addEventListener('click',resetForm);$('refreshBtn').addEventListener('click',loadRecords);
if(configured()) requireAdmin(); else message('loginMessage','Konfigurasi Supabase belum diisi. Lihat file PANDUAN-INTEGRASI.md.');
