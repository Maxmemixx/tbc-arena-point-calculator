const BRACKETS = {
    "2v2": 0.76,
    "3v3": 0.88,
    "5v5": 1.00
};

/*
 * Calculates the base arena points from rating.
 * Formula: p = ((1651.94 - 475) / (1 + 2500000 * 2.71828^(-0.009r)) + 475) * 1.5
 */
function calculateBasePoints(rating) {
    return (
        (
            (1651.94 - 475) / (1 + 2500000 * Math.pow(2.71828, -0.009 * rating))
        ) + 475 
    ) * 1.5;
}

function calculateBracketPoints(rating, bracket) {
    const basePoints = calculateBasePoints(rating);
    return basePoints * BRACKETS[bracket];
}

// Formats points as a whole number.
function formatPoints(points) {
    return Math.floor(points).toLocaleString();
}

// Update all calculations and determines which bracket gives the most points.
function updateCalculator() {

    const results = [];

    for (const bracket of Object.keys(BRACKETS)) {

        const ratingInput =
            document.getElementById(`rating-${bracket}`);

        const pointsElement =
            document.getElementById(`points-${bracket}`);

        const bracketElement =
            document.querySelector(
                `[data-bracket="${bracket}"]`
            );


        // Removes previous winner highlight.
        bracketElement.classList.remove("best");

        if (!ratingInput.value) {

            pointsElement.textContent = "—";
            continue;
        }

        const rating = Number(ratingInput.value);

        // Ignores invalid ratings.
        if (!Number.isFinite(rating) || rating < 0) {

            pointsElement.textContent = "—";
            continue;
        }

        const points = calculateBracketPoints(rating, bracket);

        pointsElement.textContent = formatPoints(points);

        results.push({
            bracket,
            points
        });
    }

    const finalPointsElement = document.getElementById("final-points");

    if (results.length === 0) {
        finalPointsElement.innerHTML = '<span class="placeholder">—</span>';
        return;
    }

    // Sorts from highest to lowest points.
    results.sort((a, b) => b.points - a.points);

    // Displays the highest number of points.
    finalPointsElement.textContent = formatPoints(results[0].points);

    // Highlights a bracket when the user has entered more than one rating.
    if (results.length > 1) {

        const best = results[0]; // The first result is the highest

        const winningBracket = document.querySelector(`[data-bracket="${best.bracket}"]`);

        winningBracket.classList.add("best");
    }
}

// Recalculates whenever a rating changes.
document.querySelectorAll("input").forEach(input => {

    input.addEventListener(
        "input",
        updateCalculator
    );

});

updateCalculator();
