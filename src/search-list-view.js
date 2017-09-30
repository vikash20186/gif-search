export class SearchListView {
	constructor(gifSearchService, template, elems){
		this.template = template;
		this.parentElem = elems.searchListElem;
		this.elems = elems;
		this.gifService = gifSearchService;
		this.init();
	}

	init(){
		this.onSearchClickBind = this.onSearchClick.bind(this);
		this.onSearchTextKeyDownBind = this.onSearchTextKeyDown.bind(this);
		this.onScrollBind = this.onScroll.bind(this);

		this.elems.searchBtnElem.addEventListener("click", this.onSearchClickBind);
		this.elems.searchTextElem.addEventListener("keydown", this.onSearchTextKeyDownBind);
		document.addEventListener("scroll", this.onScrollBind);
		
		this.lastScrollTop = 0;
		this.screenHeight = screen.height;
	}

	onSearchTextKeyDown(event){
		if (event.keyCode === 13){
			this.onSearchClick(event);
		}
	}

	onSearchClick(event){
		var searchText = this.elems.searchTextElem.value;
		if (!searchText){
			return;
		}

		this.gifService.getGifSearchResults(searchText).then(response => {
			this.updateView(response.data);
		});
		this.clearView();
		event.preventDefault();
	}

	onScroll(event){
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		if (this.lastScrollTop < scrollTop){
			requestAnimationFrame(()=>{
				this.onScrollDown(event);
			})
		}
		this.lastScrollTop = scrollTop;
	}

	onScrollDown(event){
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		if (this.gifService.canFetchMore()){
			var bottomMargin = document.documentElement.scrollHeight - (scrollTop + this.screenHeight);
			if (bottomMargin < 250){
				this.gifService.getNext().then(obj => {
					this.updateView(obj.response.data);
				});
			}
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

	getElem(gif, index){
		var divElem = document.createElement("div");
		divElem.classList.add("item");
		divElem.setAttribute("data-index", index);
		var imgElem = document.createElement("img");
		imgElem.src = gif.preview.url;
		imgElem.style.width = gif.preview.width +"px";
		imgElem.style.height = gif.preview.height +"px";
		var divInfoElem = document.createElement("div");
		divElem.appendChild(imgElem);
		divElem.appendChild(divInfoElem);
		//divInfoElem.innerHTML = index;
		return divElem;
	}

	clearView(){
		var childNodes = this.parentElem.childNodes;
		if (childNodes){
			for (let counter = childNodes.length-1; counter>=0; counter--){
				this.parentElem.removeChild(childNodes[counter]);
			}
		}
	}

	clearEvents(){
		this.elems.searchBtnElem.removeEventListener("click", this.onSearchClickBind);
		this.elems.searchTextElem.removeEventListener("keydown", this.onSearchTextKeyDownBind);
		document.removeEventListener("scroll", this.onScrollBind);
	}

	destroyView(){
		this.clearView();
		this.clearEvents();
	}
}