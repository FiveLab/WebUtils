import { beforeEach, describe, expect, it } from 'vitest';
import { endFormProcessing, readBooleanInput, readCheckboxValue, readElementValue, readFileInput, readFormData, readInputValue, readNumberInput, readRadioValue, startFormProcessing } from '../../src/dom';
import { kAttrProcessing } from '../../src/core/constants';

describe('form processing helpers', () => {
    let form: HTMLFormElement;
    let enabledInput: HTMLInputElement;
    let disabledInput: HTMLInputElement;
    let button: HTMLButtonElement;

    beforeEach(() => {
        form = document.createElement('form');

        enabledInput = document.createElement('input');
        enabledInput.name = 'enabled';

        disabledInput = document.createElement('input');
        disabledInput.name = 'disabled';
        disabledInput.disabled = true;

        button = document.createElement('button');
        button.type = 'submit';

        form.append(enabledInput, disabledInput, button);
        document.body.appendChild(form);
    });

    it('disables enabled controls on startFormProcessing', () => {
        startFormProcessing(form);

        expect(enabledInput.disabled).toBe(true);
        expect(button.disabled).toBe(true);
        expect(button.getAttribute(kAttrProcessing)).toBe('1');
        expect(disabledInput.disabled).toBe(true);
    });

    it('marks only controls disabled by processing', () => {
        startFormProcessing(form);

        expect(enabledInput.dataset.formProcessing).toBe('true');
        expect(button.dataset.formProcessing).toBe('true');
        expect(disabledInput.dataset.formProcessing).toBeUndefined();
    });

    it('restores only controls disabled by processing on endFormProcessing', () => {
        startFormProcessing(form);
        endFormProcessing(form);

        expect(enabledInput.disabled).toBe(false);
        expect(button.disabled).toBe(false);
        expect(button.getAttribute(kAttrProcessing)).toBeNull();
        expect(disabledInput.disabled).toBe(true);
    });

    it('is safe to call endFormProcessing without start', () => {
        endFormProcessing(form);

        expect(enabledInput.disabled).toBe(false);
        expect(disabledInput.disabled).toBe(true);
    });

    it('does not re-enable newly disabled controls', () => {
        startFormProcessing(form);

        enabledInput.disabled = true;
        enabledInput.removeAttribute('data-form-processing');

        endFormProcessing(form);

        expect(enabledInput.disabled).toBe(true);
    });
});


describe('read input value', () => {
    it('from text input', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = 'hello';

        expect(readInputValue(input)).toBe('hello');
    });

    it('from password input', () => {
        const input = document.createElement('input');
        input.type = 'password';
        input.value = 'secret';

        expect(readInputValue(input)).toBe('secret');
    });

    it('from hidden input', () => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.value = 'token';

        expect(readInputValue(input)).toBe('token');
    });

    it('from textarea', () => {
        const textarea = document.createElement('textarea');
        textarea.value = 'multiline\ntext';

        expect(readInputValue(textarea)).toBe('multiline\ntext');
    });

    it('from select element', () => {
        const select = document.createElement('select');

        const option1 = document.createElement('option');
        option1.value = 'a';
        option1.textContent = 'A';

        const option2 = document.createElement('option');
        option2.value = 'b';
        option2.textContent = 'B';

        select.append(option1, option2);
        select.value = 'b';

        expect(readInputValue(select)).toBe('b');
    });

    it('empty string if value is empty', () => {
        const input = document.createElement('input');
        input.value = '';

        expect(readInputValue(input)).toBe('');
    });
});

describe('read checkbox value', () => {
    it('returns true when checkbox is checked', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;

        expect(readCheckboxValue(checkbox)).toBe(true);
    });

    it('returns false when checkbox is not checked', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = false;

        expect(readCheckboxValue(checkbox)).toBe(false);
    });

    it('returns false when checkbox is unchecked by default', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        expect(readCheckboxValue(checkbox)).toBe(false);
    });

    it('throws error when input is not a checkbox', () => {
        const input = document.createElement('input');
        input.type = 'text';

        expect(() => readCheckboxValue(input)).toThrow(
            'Expected checkbox input'
        );
    });

    it('throws error when input type is missing or incorrect', () => {
        const input = document.createElement('input');

        expect(() => readCheckboxValue(input)).toThrow();
    });
});

describe('read radio value', () => {
    let form: HTMLFormElement;

    beforeEach(() => {
        form = document.createElement('form');
        document.body.appendChild(form);
    });

    it('returns value of checked radio button', () => {
        const male = document.createElement('input');
        male.type = 'radio';
        male.name = 'gender';
        male.value = 'male';

        const female = document.createElement('input');
        female.type = 'radio';
        female.name = 'gender';
        female.value = 'female';
        female.checked = true;

        form.append(male, female);

        expect(readRadioValue(form, 'gender')).toBe('female');
    });

    it('returns null when no radio is checked', () => {
        const r1 = document.createElement('input');
        r1.type = 'radio';
        r1.name = 'color';
        r1.value = 'red';

        const r2 = document.createElement('input');
        r2.type = 'radio';
        r2.name = 'color';
        r2.value = 'blue';

        form.append(r1, r2);

        expect(readRadioValue(form, 'color')).toBeNull();
    });

    it('returns null when no radio inputs with given name exist', () => {
        expect(readRadioValue(form, 'missing')).toBeNull();
    });

    it('ignores radios with different names', () => {
        const r1 = document.createElement('input');
        r1.type = 'radio';
        r1.name = 'group1';
        r1.value = 'a';
        r1.checked = true;

        const r2 = document.createElement('input');
        r2.type = 'radio';
        r2.name = 'group2';
        r2.value = 'b';
        r2.checked = true;

        form.append(r1, r2);

        expect(readRadioValue(form, 'group1')).toBe('a');
        expect(readRadioValue(form, 'group2')).toBe('b');
    });

    it('does not read radios outside the given form', () => {
        const outsideForm = document.createElement('form');

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'scope';
        radio.value = 'outside';
        radio.checked = true;

        outsideForm.appendChild(radio);
        document.body.appendChild(outsideForm);

        expect(readRadioValue(form, 'scope')).toBeNull();
    });
});

describe('read number input', () => {
    it('returns number for valid numeric value', () => {
        const input = document.createElement('input');
        input.value = '42';

        expect(readNumberInput(input)).toBe(42);
    });

    it('returns number for decimal value', () => {
        const input = document.createElement('input');
        input.value = '3.14';

        expect(readNumberInput(input)).toBe(3.14);
    });

    it('returns number for negative value', () => {
        const input = document.createElement('input');
        input.value = '-10';

        expect(readNumberInput(input)).toBe(-10);
    });

    it('returns null for empty string', () => {
        const input = document.createElement('input');
        input.value = '';

        expect(readNumberInput(input)).toBeNull();
    });

    it('returns null for whitespace-only value', () => {
        const input = document.createElement('input');
        input.value = '   ';

        expect(readNumberInput(input)).toBeNull();
    });

    it('returns null for non-numeric value', () => {
        const input = document.createElement('input');
        input.value = 'abc';

        expect(readNumberInput(input)).toBeNull();
    });

    it('returns null for partially numeric value', () => {
        const input = document.createElement('input');
        input.value = '12px';

        expect(readNumberInput(input)).toBeNull();
    });

    it('returns null for NaN-like value', () => {
        const input = document.createElement('input');
        input.value = 'NaN';

        expect(readNumberInput(input)).toBeNull();
    });

    it('does not throw for any input value', () => {
        const input = document.createElement('input');

        expect(() => {
            input.value = '123';
            readNumberInput(input);

            input.value = '';
            readNumberInput(input);

            input.value = 'foo';
            readNumberInput(input);
        }).not.toThrow();
    });
});

describe('read boolean input', () => {
    it('returns true when input is checked', () => {
        const input = document.createElement('input');
        input.checked = true;

        expect(readBooleanInput(input)).toBe(true);
    });

    it('returns false when input is not checked', () => {
        const input = document.createElement('input');
        input.checked = false;

        expect(readBooleanInput(input)).toBe(false);
    });

    it('returns false when checked is not set (default)', () => {
        const input = document.createElement('input');

        expect(readBooleanInput(input)).toBe(false);
    });

    it('ignores input value', () => {
        const input = document.createElement('input');
        input.value = 'true';
        input.checked = false;

        expect(readBooleanInput(input)).toBe(false);

        input.checked = true;
        input.value = 'false';

        expect(readBooleanInput(input)).toBe(true);
    });

    it('works for non-checkbox inputs as well', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.checked = true;

        expect(readBooleanInput(input)).toBe(true);
    });

    it('does not throw for any input state', () => {
        const input = document.createElement('input');

        expect(() => {
            input.checked = true;
            readBooleanInput(input);

            input.checked = false;
            readBooleanInput(input);
        }).not.toThrow();
    });
});

describe('read file input', () => {
    it('returns null when no files selected', () => {
        const input = document.createElement('input');
        input.type = 'file';

        expect(readFileInput(input)).toBeNull();
    });

    it('returns single File when one file selected', () => {
        const input = document.createElement('input');
        input.type = 'file';

        const file = new File(['content'], 'test.txt', {type: 'text/plain'});

        Object.defineProperty(input, 'files', {
            value: [file],
            writable: false,
        });

        const result = readFileInput(input);

        expect(result).toBeInstanceOf(File);
        expect((result as File).name).toBe('test.txt');
    });

    it('returns File[] when multiple files selected and input.multiple = true', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;

        const file1 = new File(['a'], 'a.txt');
        const file2 = new File(['b'], 'b.txt');

        Object.defineProperty(input, 'files', {
            value: [file1, file2],
            writable: false,
        });

        const result = <File[]>readFileInput(input);

        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('a.txt');
        expect(result[1].name).toBe('b.txt');
    });

    it('returns first File when multiple files selected but input.multiple = false', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = false;

        const file1 = new File(['a'], 'a.txt');
        const file2 = new File(['b'], 'b.txt');

        Object.defineProperty(input, 'files', {
            value: [file1, file2],
            writable: false,
        });

        const result = readFileInput(input);

        expect(result).toBeInstanceOf(File);
        expect((result as File).name).toBe('a.txt');
    });

    it('throws TypeError when input is not file type', () => {
        const input = document.createElement('input');
        input.type = 'text';

        expect(() => readFileInput(input)).toThrow(new TypeError('Expected file input'));
    });
});

describe('read element value', () => {
    it('reads value from text input', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = 'hello';

        expect(readElementValue(input)).toBe('hello');
    });

    it('reads value from password input', () => {
        const input = document.createElement('input');
        input.type = 'password';
        input.value = 'secret';

        expect(readElementValue(input)).toBe('secret');
    });

    it('reads value from hidden input', () => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.value = 'token';

        expect(readElementValue(input)).toBe('token');
    });

    it('reads value from textarea', () => {
        const textarea = document.createElement('textarea');
        textarea.value = 'multiline';

        expect(readElementValue(textarea)).toBe('multiline');
    });

    it('reads value from select element', () => {
        const select = document.createElement('select');

        const opt1 = document.createElement('option');
        opt1.value = 'a';
        opt1.textContent = 'A';

        const opt2 = document.createElement('option');
        opt2.value = 'b';
        opt2.textContent = 'B';

        select.append(opt1, opt2);
        select.value = 'b';

        expect(readElementValue(select)).toBe('b');
    });

    it('reads boolean from checkbox input', () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;

        expect(readElementValue(checkbox)).toBe(true);
    });

    it('reads number from number input', () => {
        const input = document.createElement('input');
        input.type = 'number';
        input.value = '42';

        expect(readElementValue(input)).toBe(42);
    });

    it('returns null for invalid number input', () => {
        const input = document.createElement('input');
        input.type = 'number';
        input.value = 'abc';

        expect(readElementValue(input)).toBeNull();
    });

    it('returns null for unsupported element', () => {
        const div = document.createElement('div');

        expect(readElementValue(div)).toBeNull();
    });

    it('reads value from radio group via radio element', () => {
        const form = document.createElement('form');

        const r1 = document.createElement('input');
        r1.type = 'radio';
        r1.name = 'color';
        r1.value = 'red';

        const r2 = document.createElement('input');
        r2.type = 'radio';
        r2.name = 'color';
        r2.value = 'blue';
        r2.checked = true;

        form.append(r1, r2);
        document.body.appendChild(form);

        expect(readElementValue(r1)).toBe('blue');
        expect(readElementValue(r2)).toBe('blue');
    });

    it('reads file input via readElementValue', () => {
        const input = document.createElement('input');
        input.type = 'file';

        const file = new File(['x'], 'file.txt');

        Object.defineProperty(input, 'files', {
            value: [file],
            writable: false,
        });

        const result = readElementValue(input);

        expect(result).toBeInstanceOf(File);
        expect((result as File).name).toBe('file.txt');
    });

    it('does not throw for any element', () => {
        const el = document.createElement('div');

        expect(() => readElementValue(el)).not.toThrow();
    });
});

describe('read form data', () => {
    it('returns URLSearchParams by default', () => {
        const form = document.createElement('form');

        const input = document.createElement('input');
        input.name = 'q';
        input.value = 'test';

        form.append(input);

        const result = readFormData(form);

        expect(result).toBeInstanceOf(URLSearchParams);
        expect(result.get('q')).toBe('test');
    });

    it('returns URLSearchParams explicitly', () => {
        const form = document.createElement('form');

        const input = document.createElement('input');
        input.name = 'a';
        input.value = '1';

        form.append(input);

        const result = readFormData(form, URLSearchParams);

        expect(result).toBeInstanceOf(URLSearchParams);
        expect(result.get('a')).toBe('1');
    });

    it('returns FormData when requested', () => {
        const form = document.createElement('form');

        const input = document.createElement('input');
        input.name = 'x';
        input.value = '42';

        form.append(input);

        const result = readFormData(form, FormData);

        expect(result).toBeInstanceOf(FormData);
        expect(result.get('x')).toBe('42');
    });

    it('serializes checkbox as boolean', () => {
        const form = document.createElement('form');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'active';
        checkbox.checked = true;

        form.append(checkbox);

        const result = readFormData(form);

        expect(result.get('active')).toBe('1');
    });

    it('serializes number input', () => {
        const form = document.createElement('form');

        const input = document.createElement('input');
        input.type = 'number';
        input.name = 'count';
        input.value = '5';

        form.append(input);

        const result = readFormData(form);

        expect(result.get('count')).toBe('5');
    });

    it('serializes radio group correctly', () => {
        const form = document.createElement('form');

        const r1 = document.createElement('input');
        r1.type = 'radio';
        r1.name = 'color';
        r1.value = 'red';

        const r2 = document.createElement('input');
        r2.type = 'radio';
        r2.name = 'color';
        r2.value = 'blue';
        r2.checked = true;

        form.append(r1, r2);

        const result = readFormData(form);

        expect(result.get('color')).toBe('blue');
    });

    it('ignores elements without name', () => {
        const form = document.createElement('form');

        const input = document.createElement('input');
        input.value = 'x';

        form.append(input);

        const result = readFormData(form);

        expect([...result.keys()]).toHaveLength(0);
    });

    it('ignores disabled elements', () => {
        const form = document.createElement('form');

        const input = document.createElement('input');
        input.name = 'secret';
        input.value = '123';
        input.disabled = true;

        form.append(input);

        const result = readFormData(form);

        expect(result.get('secret')).toBeNull();
    });

    it('handles file input as FormData', () => {
        const form = document.createElement('form');

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.name = 'file';

        const file = new File(['data'], 'test.txt');

        Object.defineProperty(fileInput, 'files', {
            value: [file],
            writable: false,
        });

        form.append(fileInput);

        const result = readFormData(form, FormData);

        expect(result.get('file')).toBeInstanceOf(File);
        expect((result.get('file') as File).name).toBe('test.txt');
    });

    it('appends multiple values with same name', () => {
        const form = document.createElement('form');

        const input1 = document.createElement('input');
        input1.name = 'tag';
        input1.value = 'a';

        const input2 = document.createElement('input');
        input2.name = 'tag';
        input2.value = 'b';

        form.append(input1, input2);

        const result = readFormData(form);

        expect(result.getAll('tag')).toEqual(['a', 'b']);
    });
});