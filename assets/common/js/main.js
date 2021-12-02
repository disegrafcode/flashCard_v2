async function createMenu() {
   let menu = document.getElementById("menu");
   try {
       let response = await fetch(`assets/common/template/menu.html`);
       let data = await response.text();
       menu.innerHTML = data;

   } catch (err) {
       console.error(err);
   }
}
/* MAKE FIRST THE MENU */
createMenu();
/* MAKE FIRST THE MENU */

/* CREATE LIST OF WORDS */
/*let sidebar = document.createElement('div');
sidebar.style.width = "325px";
sidebar.style.height = "100%";
sidebar.style.position = "fixed";
sidebar.style.width */
/* CREATE LIST OF WORDS */