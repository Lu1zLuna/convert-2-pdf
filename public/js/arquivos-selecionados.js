// Carrega os arquivos de que foram uploadados na view
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("file-input");
    const uploadMessage = document.getElementById("upload-message");
    const fileList = document.querySelector(".file-list p");

    input.addEventListener("change", () => {
        const files = Array.from(input.files);

            // limpa o conteúdo anterior da lista
        fileList.innerHTML = "";

        if (files.length === 0) {
        uploadMessage.textContent = "";
        fileList.innerHTML = `<p class="text-muted text-center">Nenhum arquivo selecionado.</p>`;
        return;
        }

        // Atualiza a lista de arquivos
        const nomes = files.map(f => f.name).join(", ");

        // Exibe a mensagem de envio
        uploadMessage.innerHTML = `
        <div class="alert alert-info mx-5 mt-0 mb-3 text-center" role="alert">
            Você está enviando ${files.length > 1 ? 'esses arquivos' : 'esse arquivo'} para conversão: <strong>${nomes}</strong>
        </div>
        `;
    });
});
