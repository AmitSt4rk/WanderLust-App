const priceFilters = document.querySelectorAll(".price-filter");

priceFilters.forEach(container => {
    const rangeInput = container.querySelectorAll(".range-input input");
    const priceInput = container.querySelectorAll(".price-input input");
    const progress = container.querySelector(".slider .progress");
    const icon = container.querySelector('.price-filter-icon');
    const box = container.querySelector('.price-filter-box');
    const btn = container.querySelector('.price-filter-btn');
    
    let priceGap = 1000;

    const updateProgress = () => {
        let minVal = parseInt(rangeInput[0].value);
        let maxVal = parseInt(rangeInput[1].value);
        progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
        progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
    };

    if(icon && box) {
        icon.addEventListener('click', () => box.style.display = "block");
        btn.addEventListener('click', () => box.style.display = "none");
    }

    priceInput.forEach(input => {
        input.addEventListener("input", e => {
            let minPrice = parseInt(priceInput[0].value),
                maxPrice = parseInt(priceInput[1].value);

            if ((maxPrice - minPrice >= priceGap) && maxPrice <= 10000) {
                if (e.target.classList.contains("input-min")) {
                    rangeInput[0].value = minPrice;
                } else {
                    rangeInput[1].value = maxPrice;
                }
                updateProgress();
            }
        });
    });

    rangeInput.forEach(input => {
        input.addEventListener("input", e => {
            let minVal = parseInt(rangeInput[0].value),
                maxVal = parseInt(rangeInput[1].value);

            if (maxVal - minVal < priceGap) {
                if (e.target.className === "range-min") {
                    rangeInput[0].value = maxVal - priceGap;
                } else {
                    rangeInput[1].value = minVal + priceGap;
                }
            } else {
                priceInput[0].value = minVal;
                priceInput[1].value = maxVal;
                updateProgress();
            }
        });
    });

    updateProgress();
});