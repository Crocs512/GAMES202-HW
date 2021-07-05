function getRotationPrecomputeL(precompute_L, rotationMatrix){
	let rotMatBand1 = computeSquareMatrix_3by3(rotationMatrix);
	let rotMatBand2 = computeSquareMatrix_5by5(rotationMatrix);

	let result = [];

	for(let i = 0; i < 3; i++)
	{
		let rotSHBand1 = math.multiply(rotMatBand1, [precompute_L[i][1], precompute_L[i][2], precompute_L[i][3]]);
		let rotSHBand2 = math.multiply(rotMatBand2, [precompute_L[i][4], precompute_L[i][5], precompute_L[i][6],
			precompute_L[i][7], precompute_L[i][8]]);
		
		result[i] = mat3.fromValues(precompute_L[i][0], rotSHBand1._data[0], rotSHBand1._data[1],
									rotSHBand1._data[2], rotSHBand2._data[0], rotSHBand2._data[1], 
									rotSHBand2._data[2], rotSHBand2._data[3], rotSHBand2._data[4]); 
	}
	return result;
}

function computeSquareMatrix_3by3(rotationMatrix){ // 计算方阵SA(-1) 3*3 
	
	// 1、pick ni - {ni}
	let n1 = [1, 0, 0, 0]; let n2 = [0, 0, 1, 0]; let n3 = [0, 1, 0, 0];

	// 2、{P(ni)} - A  A_inverse
	let pSH1 = SHEval(n1[0], n1[1], n1[2], 3);
	let pSH2 = SHEval(n2[0], n2[1], n2[2], 3);
	let pSH3 = SHEval(n3[0], n3[1], n3[2], 3);
	let A_mat = math.matrix([[pSH1[1], pSH1[2], pSH1[3]],
						[pSH2[1], pSH2[2], pSH2[3]],
						[pSH3[1], pSH3[2], pSH3[3]]]);
	let A_inverse_mat = math.inv(A_mat);
	// 3、用 R 旋转 ni - {R(ni)}
	let n1_rot = vec4.create();
	let n2_rot = vec4.create();
	let n3_rot = vec4.create();
	vec4.transformMat4(n1_rot, n1, rotationMatrix);
	vec4.transformMat4(n2_rot, n2, rotationMatrix);
	vec4.transformMat4(n3_rot, n3, rotationMatrix);

	// 4、R(ni) SH投影 - S
	let pRotSH1 = SHEval(n1_rot[0], n1_rot[1], n1_rot[2], 3);
	let pRotSH2 = SHEval(n2_rot[0], n2_rot[1], n2_rot[2], 3);
	let pRotSH3 = SHEval(n3_rot[0], n3_rot[1], n3_rot[2], 3);

	let S_mat = math.matrix([[pRotSH1[1], pRotSH1[2], pRotSH1[3]],
					[pRotSH2[1], pRotSH2[2], pRotSH2[3]],
					[pRotSH3[1], pRotSH3[2], pRotSH3[3]]]);

	// 5、S*A_inverse
	let result = math.multiply(S_mat, A_inverse_mat);
	return result;
}

function computeSquareMatrix_5by5(rotationMatrix){ // 计算方阵SA(-1) 5*5
	
	// 1、pick ni - {ni}
	let k = 1 / math.sqrt(2);
	let n1 = [1, 0, 0, 0]; let n2 = [0, 0, 1, 0]; let n3 = [k, k, 0, 0]; 
	let n4 = [k, 0, k, 0]; let n5 = [0, k, k, 0];

	// 2、{P(ni)} - A  A_inverse
	let pSH1 = SHEval(n1[0], n1[1], n1[2], 3);
	let pSH2 = SHEval(n2[0], n2[1], n2[2], 3);
	let pSH3 = SHEval(n3[0], n3[1], n3[2], 3);
	let pSH4 = SHEval(n4[0], n4[1], n4[2], 3);
	let pSH5 = SHEval(n5[0], n5[1], n5[2], 3);
	let A_mat = math.matrix([[pSH1[4], pSH1[5], pSH1[6],pSH1[7],pSH1[8]],
						[pSH2[4], pSH2[5], pSH2[6],pSH2[7], pSH2[8]],
						[pSH3[4], pSH3[5], pSH3[6],pSH3[7], pSH3[8]],
						[pSH4[4], pSH4[5], pSH4[6],pSH4[7], pSH4[8]],
						[pSH5[4], pSH5[5], pSH5[6],pSH5[7], pSH5[8]]]);
	let A_inverse_mat = math.inv(A_mat);
	// 3、用 R 旋转 ni - {R(ni)}
	let n1_rot = vec4.create();
	let n2_rot = vec4.create();
	let n3_rot = vec4.create();
	let n4_rot = vec4.create();
	let n5_rot = vec4.create();
	vec4.transformMat4(n1_rot, n1, rotationMatrix);
	vec4.transformMat4(n2_rot, n2, rotationMatrix);
	vec4.transformMat4(n3_rot, n3, rotationMatrix);
	vec4.transformMat4(n4_rot, n4, rotationMatrix);
	vec4.transformMat4(n5_rot, n5, rotationMatrix);

	// 4、R(ni) SH投影 - S
	let pRotSH1 = SHEval(n1_rot[0], n1_rot[1], n1_rot[2], 3);
	let pRotSH2 = SHEval(n2_rot[0], n2_rot[1], n2_rot[2], 3);
	let pRotSH3 = SHEval(n3_rot[0], n3_rot[1], n3_rot[2], 3);
	let pRotSH4 = SHEval(n4_rot[0], n4_rot[1], n4_rot[2], 3);
	let pRotSH5 = SHEval(n5_rot[0], n5_rot[1], n5_rot[2], 3);

	let S_mat = math.matrix([[pRotSH1[4], pRotSH1[5], pRotSH1[6],pRotSH1[7],pRotSH1[8]],
					[pRotSH2[4], pRotSH2[5], pRotSH2[6],pRotSH2[7], pRotSH2[8]],
					[pRotSH3[4], pRotSH3[5], pRotSH3[6],pRotSH3[7], pRotSH3[8]],
					[pRotSH4[4], pRotSH4[5], pRotSH4[6],pRotSH4[7], pRotSH4[8]],
					[pRotSH5[4], pRotSH5[5], pRotSH5[6],pRotSH5[7], pRotSH5[8]]]);

	// 5、S*A_inverse
	let result = math.multiply(S_mat, A_inverse_mat);
	return result;
}

function mat4Matrix2mathMatrix(rotationMatrix){

	let mathMatrix = [];
	for(let i = 0; i < 4; i++){
		let r = [];
		for(let j = 0; j < 4; j++){
			r.push(rotationMatrix[i*4+j]);
		}
		mathMatrix.push(r);
	}
	return math.matrix(mathMatrix)

}

function getMat3ValueFromRGB(precomputeL){

    let colorMat3 = [];
    for(var i = 0; i<3; i++){
        colorMat3[i] = mat3.fromValues( precomputeL[0][i], precomputeL[1][i], precomputeL[2][i],
										precomputeL[3][i], precomputeL[4][i], precomputeL[5][i],
										precomputeL[6][i], precomputeL[7][i], precomputeL[8][i] ); 
	}
    return colorMat3;
}