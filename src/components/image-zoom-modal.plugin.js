export const processClientEntry = () => {
  // Inject styles.
  const styles = `
  
    body.theme-dark .modal{
      background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
    }
    .modal {
      opacity: 0;
      position: fixed; 
      z-index: -1;
      padding-top: 80px;
      left: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow:auto;
      transform: scale(0.5);
      top:0;
      background-color: rgba(255,255,255,0.9); /* Black w/ opacity */
      transition: transform 0.2s, opacity 0.6s, z-index 0.8s;
    }
    .modal.show {
      opacity: 1;
      z-index: 350;
      transform: scale(1)
    }
    .modal.show:hover {
      cursor: zoom-out;
    }
    .blog-image:hover {
      cursor: zoom-in;
    }
    .modal-content picture {
      margin: auto;
    }
    .modal-content img {
      max-width: 100%;
      height:100%;
      position: relative !important;
      object-fit: contain !important;
       margin: 0 auto;
      display: block;

    }
    .modal-content {
    
      width: 100%;
      height: calc(100% - 160px);
      
    }

      /* 100% Image Width on Smaller Screens */
      @media only screen and (max-width: 700px){
        .modal-content {
          width: 100%;
        }
      }
  `;

  const node = document.createElement('div');
  node.id = 'zoom-modal';
  node.classList.add('modal');
  node.innerHTML = `
  <div class='modal-content' id='img01'></div>`;
  document.body.append(node);
  const styleEl = document.createElement('style');
  styleEl.id = 'zoom-style';
  styleEl.innerHTML = styles;
  document.head.appendChild(styleEl);
};


export function runZoom() {
  const modal = document.getElementById('zoom-modal');
  const modalImg = document.getElementById('img01');
  let isModalVisible = false;
  const children = [...document.querySelectorAll('.gatsby-resp-image-figure'), ...document.querySelectorAll('.blog-image-wrapper')];

  children.forEach(
    (e) => {
      e.onclick = function (event) {
        const picture = this.getElementsByClassName('blog-image')[0];
        modalImg.innerHTML = picture.outerHTML;
        isModalVisible = true;
        modal.classList.add('show');
        event.stopPropagation();
      };
    },
  );

  function hideModal() {
    modal.classList.remove('show');
    isModalVisible = false;
  }

  window.onclick = function () {
    if (isModalVisible) {
      hideModal();
    }
  };
  window.onscroll = function () {
    if (isModalVisible) {
      hideModal();
    }
  };
}
