#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const webpack = require( 'webpack' );
const { logger, bundler } = require( '@ckeditor/ckeditor5-dev-utils' );
const webpackUtils = require( '@ckeditor/ckeditor5-dev-webpack-utils' );
const buildConfig = require( '../config-build' );
const log = logger();
const entryPoint = 'ckeditor.js';

log.info( 'Creating the entry file...' );

bundler.createEntryFile( entryPoint, './config-editor', {
	plugins: buildConfig.plugins,
	moduleName: buildConfig.moduleName,
	editor: buildConfig.editor
} );

const packageRoot = path.join( __dirname, '..' );
const webpackParams = {
	entryPoint: path.join( packageRoot, entryPoint ),
	destinationPath: path.join( packageRoot, buildConfig.destinationPath )
};
const webpackConfig = webpackUtils.getWebpackConfig( webpackParams );
const webpackCompatConfig = webpackUtils.getWebpackCompatConfig( webpackParams );

log.info( `Building...` );

Promise.all( [
	runWebpack( webpackConfig ).then( () => log.info( 'Finished building "build/ckeditor.js".' ) ),
	runWebpack( webpackCompatConfig ).then( () => log.info( 'Finished building "build/ckeditor.compat.js".' ) )
] )
.then( () => {
	log.info( 'Done.' );
} )
.catch( ( err ) => {
	process.exitCode = -1;

	log.error( err );
} );

function runWebpack( config ) {
	return new Promise( ( resolve, reject ) => {
		webpack( config, ( err ) => {
			if ( err ) {
				return reject( err );
			}

			return resolve();
		} );
	} );
}
