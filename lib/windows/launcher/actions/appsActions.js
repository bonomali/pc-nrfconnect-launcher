/* Copyright (c) 2015 - 2017, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { ipcRenderer } from 'electron';
import ipc from '../../../util/ipc';
import * as ErrorDialogActions from '../../../actions/errorDialogActions';

export const LAUNCH_APP = 'LAUNCH_APP';
export const LOAD_LOCAL_APPS = 'LOAD_LOCAL_APPS';
export const LOAD_LOCAL_APPS_SUCCESS = 'LOAD_LOCAL_APPS_SUCCESS';
export const LOAD_LOCAL_APPS_ERROR = 'LOAD_LOCAL_APPS_ERROR';
export const LOAD_OFFICIAL_APPS = 'LOAD_OFFICIAL_APPS';
export const LOAD_OFFICIAL_APPS_SUCCESS = 'LOAD_OFFICIAL_APPS_SUCCESS';
export const LOAD_OFFICIAL_APPS_ERROR = 'LOAD_OFFICIAL_APPS_ERROR';
export const INSTALL_OFFICIAL_APP = 'INSTALL_OFFICIAL_APP';
export const INSTALL_OFFICIAL_APP_SUCCESS = 'INSTALL_OFFICIAL_APP_SUCCESS';
export const INSTALL_OFFICIAL_APP_ERROR = 'INSTALL_OFFICIAL_APP_ERROR';
export const REMOVE_OFFICIAL_APP = 'REMOVE_OFFICIAL_APP';
export const REMOVE_OFFICIAL_APP_SUCCESS = 'REMOVE_OFFICIAL_APP_SUCCESS';
export const REMOVE_OFFICIAL_APP_ERROR = 'REMOVE_OFFICIAL_APP_ERROR';
export const UPGRADE_OFFICIAL_APP = 'UPGRADE_OFFICIAL_APP';
export const UPGRADE_OFFICIAL_APP_SUCCESS = 'UPGRADE_OFFICIAL_APP_SUCCESS';
export const UPGRADE_OFFICIAL_APP_ERROR = 'UPGRADE_OFFICIAL_APP_ERROR';

function launchAppAction(app) {
    return {
        type: LAUNCH_APP,
        app,
    };
}

function loadLocalAppsAction() {
    return {
        type: LOAD_LOCAL_APPS,
    };
}

function loadLocalAppsSuccess(apps) {
    return {
        type: LOAD_LOCAL_APPS_SUCCESS,
        apps,
    };
}

function loadLocalAppsError() {
    return {
        type: LOAD_LOCAL_APPS_ERROR,
    };
}

function loadOfficialAppsAction() {
    return {
        type: LOAD_OFFICIAL_APPS,
    };
}

function loadOfficialAppsSuccess(apps) {
    return {
        type: LOAD_OFFICIAL_APPS_SUCCESS,
        apps,
    };
}

function loadOfficialAppsError() {
    return {
        type: LOAD_OFFICIAL_APPS_ERROR,
    };
}

function installOfficialAppAction(name) {
    return {
        type: INSTALL_OFFICIAL_APP,
        name,
    };
}

function installOfficialAppSuccessAction(name) {
    return {
        type: INSTALL_OFFICIAL_APP_SUCCESS,
        name,
    };
}

function installOfficialAppErrorAction() {
    return {
        type: INSTALL_OFFICIAL_APP_ERROR,
    };
}

function removeOfficialAppAction(name) {
    return {
        type: REMOVE_OFFICIAL_APP,
        name,
    };
}

function removeOfficialAppSuccessAction(name) {
    return {
        type: REMOVE_OFFICIAL_APP_SUCCESS,
        name,
    };
}

function removeOfficialAppErrorAction() {
    return {
        type: REMOVE_OFFICIAL_APP_ERROR,
    };
}

function upgradeOfficialAppAction(name, version) {
    return {
        type: UPGRADE_OFFICIAL_APP,
        name,
        version,
    };
}

function upgradeOfficialAppSuccessAction(name, version) {
    return {
        type: UPGRADE_OFFICIAL_APP_SUCCESS,
        name,
        version,
    };
}

function upgradeOfficialAppErrorAction() {
    return {
        type: UPGRADE_OFFICIAL_APP_ERROR,
    };
}

export function loadLocalApps() {
    return dispatch => {
        dispatch(loadLocalAppsAction());
        ipc.getLocalApps()
            .then(apps => dispatch(loadLocalAppsSuccess(apps)))
            .catch(error => {
                dispatch(loadLocalAppsError());
                dispatch(ErrorDialogActions.showDialog(error.message));
            });
    };
}

export function loadOfficialApps() {
    return dispatch => {
        dispatch(loadOfficialAppsAction());
        ipc.getOfficialApps()
            .then(apps => dispatch(loadOfficialAppsSuccess(apps)))
            .catch(error => {
                dispatch(loadOfficialAppsError());
                dispatch(ErrorDialogActions.showDialog(error.message));
            });
    };
}

export function installOfficialApp(name) {
    return dispatch => {
        dispatch(installOfficialAppAction(name));
        ipc.installOfficialApp(name)
            .then(() => {
                dispatch(installOfficialAppSuccessAction(name));
                dispatch(loadOfficialApps());
            })
            .catch(error => {
                dispatch(installOfficialAppErrorAction());
                dispatch(ErrorDialogActions.showDialog(error.message));
            });
    };
}

export function removeOfficialApp(name) {
    return dispatch => {
        dispatch(removeOfficialAppAction(name));
        ipc.removeOfficialApp(name)
            .then(() => {
                dispatch(removeOfficialAppSuccessAction(name));
                dispatch(loadOfficialApps());
            })
            .catch(error => {
                dispatch(removeOfficialAppErrorAction());
                dispatch(ErrorDialogActions.showDialog(error.message));
            });
    };
}

export function upgradeOfficialApp(name, version) {
    return dispatch => {
        dispatch(upgradeOfficialAppAction(name, version));
        ipc.installOfficialApp(`${name}@${version}`)
            .then(() => {
                dispatch(upgradeOfficialAppSuccessAction(name, version));
                dispatch(loadOfficialApps());
            })
            .catch(error => {
                dispatch(upgradeOfficialAppErrorAction());
                dispatch(ErrorDialogActions.showDialog(error.message));
            });
    };
}

export function launchApp(app) {
    return dispatch => {
        dispatch(launchAppAction(app));

        // The apps in state are Immutable Maps which cannot be sent over IPC.
        // Converting to plain JS object before sending to the main process.
        const appObj = app.toJS();
        ipcRenderer.send('open-app', appObj);
    };
}