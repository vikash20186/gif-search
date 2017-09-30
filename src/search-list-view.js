export class SearchListView {
	constructor(gifSearchService, template, elems){
		this.template = template;
		this.parentElem = elems.searchListElem;
		this.elems = elems;
		this.gifService = gifSearchService;
		this.init();
	}

	init(){
		this.elems.searchBtnElem.addEventListener("click", this.onSearchClick.bind(this));
		document.addEventListener("scroll", this.onScroll.bind(this));
		this.lastScrollTop = 0;
		this.screenHeight = screen.height;
	}

	onSearchClick(event){
		var searchText = this.elems.searchTextElem.value;
		if (!searchText){
			return;
		}

		this.gifService.getGifSearchResults(searchText).then(response => {
			this.updateView(response.data);
		});
		clearView();
		event.preventDefault();
	}

	onScroll(event){
		if (this.lastScrollTop < document.body.scrollTop){
			requestAnimationFrame(()=>{
				this.onScrollDown(event);
			})
		}
		this.lastScrollTop = document.body.scrollTop;
	}

	onScrollDown(event){
		if (this.gifService.isRequestInProgress){
			return false;
		}
		var bottomMargin = document.body.scrollHeight - (document.body.scrollTop + this.screenHeight);
		if (bottomMargin < 250){
			this.gifService.getNext().then(obj => {
				this.updateView(obj.response.data);
			});
		}
	}

	updateView(gifs){
		var documentFragmentElem = document.createDocumentFragment();
		gifs.map(this.getElem)
			.forEach(divElem => {
				documentFragmentElem.appendChild(divElem);
			});
		this.parentElem.appendChild(documentFragmentElem);
	}

	getElem(gif){
		var divElem = document.createElement("div");
		divElem.classList.add("item");
		var imgElem = document.createElement("img");
		imgElem.src = gif.preview.url;
		imgElem.style.width = gif.preview.width +"px";
		imgElem.style.height = gif.preview.height +"px";
		var divInfoElem = document.createElement("div");
		divElem.appendChild(imgElem);
		divElem.appendChild(divInfoElem);
		return divElem;
	}

	clearView(){
		var childNodes = this.parentElem.childNodes;
		if (childNodes){
			for (let counter = childNodes.length; counter>=0; counter--){
				this.parentElem.removeChild(childNodes[counter]);
			}
		}
	}
}