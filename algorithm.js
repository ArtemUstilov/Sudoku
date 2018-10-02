Array.prototype.remove = function(value) {
    let idx = this.indexOf(value);
    if(idx != -1) {
        return this.splice(idx, 1);
    }
    return false;
}
Array.prototype.copy = function() {
    let res = []
    this.forEach(x => res.push(x.slice(0)))
    return res
}
results = []



function findPosVal(i, j, matrix) {
    let res = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    for(let k = 0; k < 9; k++) {
        res.remove(matrix[k][j])
        res.remove(matrix[i][k])
    }
    let rowSq = (i < 3) ? [0, 2] : (i < 6) ? [3, 5] : [6, 8];
    let lineSq = (j < 3) ? [0, 2] : (j < 6) ? [3, 5] : [6, 8];
    for(let k = rowSq[0]; k <= rowSq[1]; k++)
        for(let m = lineSq[0]; m <= lineSq[1]; m++)
            res.remove(matrix[k][m])
    return res
}


function fillCell(ma, i, j, val) {
    let matrix = ma.copy()
    results.push([i, j, val]);
    if(isRight(matrix)) {
        return true;
    }
    let success = false;
    let find = false;
    for(let i = 0; i < 9 && !find; i++) {
        for(let j = 0; j < 9 && !find; j++) {
            if(matrix[i][j] == '*') {
                find = true;
                let possibilities = findPosVal(i, j, matrix)
                if(possibilities.length < 1) return false;
                for(let r = 0; r < possibilities.length; r++) {
                    let mat = matrix.copy()
                    mat[i][j] = possibilities[r];
                    if(!success) success = fillCell(mat, i, j, possibilities[r]);
                }
            }
        }
    }
    if(!success) {
        results.remove([i, j, val])
    }
    return success;
}

function isRight(matr) {
    if(matr.every(x => x.every(y => y != '*'))) return false;
    let sumRow = []
    let sumCol = []
    for(let i = 0; i < matr.length; i++) {
        for(let j = 0; j < matr[0].length; j++) {
            if(!sumRow.includes(matr[i][j]))
                sumRow.push(matr[i][j])
            if(!sumCol.includes(matr[j][i]))
                sumCol.push(matr[j][i])
        }
        if(sumCol.length != matr.length || sumRow.length != matr.length) return false;
        sumCol = []
        sumRow = []
    }
    for(let k = 1; k < 4; k++) {
        let sum = []
        for(let m = 1; m < 4; m++) {
            for(let i = matr.length / 3 * k - matr.length / 3; i < matr.length / 3 * k; i++) {
                for(let j = matr.length / 3 * m - matr.length / 3; j < matr.length / 3 * m; j++) {
                    if(!sum.includes(matr[i][j])) sum.push(matr[i][j])
                }
            }
            if(sum.length != matr.length) return false
            sum = []
        }
    }
    return true
}

function getSolution(matrix) {
    let result = matrix.copy()
    fillCell(matrix)
    results.slice(1).forEach(x => {
        result[x[0]][x[1]] = x[2]
    })
    let ind = result.findIndex((x)=>x.includes('*'));
    let jind = result[ind].findIndex(x=>x=='*')
    result[ind][jind] = findPosVal(ind, jind, result)[0]
    return result
}
