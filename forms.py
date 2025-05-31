# ...existing code...

class ClaimForm(forms.ModelForm):
    incognito = forms.BooleanField(required=False, label="Incognito Mode")
    class Meta:
        model = Claim
        fields = [
            # ...existing fields...
            'incognito',
        ]
    # ...existing code...
