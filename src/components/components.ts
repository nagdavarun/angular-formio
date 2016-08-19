import { Compiler, ComponentFactory, Component } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup  } from '@angular/forms';
import { FormioComponentsComponent } from '../formio-components.component';
import { FormioComponentComponent } from '../formio-component.component';

export interface FormioComponentsTemplate {
    button: string,
    columns: string,
    container: string,
    datagrid: string,
    input: string,
    textarea: string,
    hidden: string,
    radio: string,
    checkbox: string,
    custom: string,
    table: string,
    panel: string,
    fieldset: string,
    well: string
}

export interface FormioComponentMetaData {
    template: string,
    selector?: string,
    directives?: Array<any>,
    inputs?: Array<string>
}

export interface FormioComponentWrapper {
    component?: any,
    element?: any,
    metadata?: FormioComponentMetaData
}

export class FormioComponents {
    public static components:FormioComponentWrapper = {};
    public static register(
        name: string,
        component: any,
        element: any,
        metadata: FormioComponentMetaData
    ) {
        metadata.selector = metadata.selector || 'formio-' + name;
        metadata.directives = metadata.directives || [
            REACTIVE_FORM_DIRECTIVES,
            FormioComponentsComponent,
            FormioComponentComponent
        ];
        metadata.inputs = metadata.inputs || ['component', 'form'];
        FormioComponents.components[name] = {
            component: component,
            element: element,
            metadata: metadata
        };
    }
    public static createComponent(name: string, form: FormGroup, component: any) : any {
        if (!FormioComponents.components.hasOwnProperty(name)) {
            name = 'custom';
        }
        let comp: FormioComponentWrapper = FormioComponents.components[name];
        return new comp.component(form, component);
    }
    public static element(
        name: string,
        compiler: Compiler
    ) : Promise<ComponentFactory<any>> {
        if (!FormioComponents.components.hasOwnProperty(name)) {
            name = 'custom';
        }
        let component: FormioComponentWrapper = FormioComponents.components[name];
        const decoratedCmp = Component(component.metadata)(component.element);
        return compiler.compileComponentAsync(decoratedCmp);
    }
}