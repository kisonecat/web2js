@x
@d eTeX_int=badness_code+1 {first of \eTeX\ codes for integers}
@d eTeX_dim=eTeX_int+8 {first of \eTeX\ codes for dimensions}
@y
@d eTeX_int=badness_code+1 {first of \eTeX\ codes for integers}
@d jstex_version_code=eTeX_int+8 {code for \.{\\jsTeXversion}}
@d eTeX_dim=eTeX_int+9 {first of \eTeX\ codes for dimensions}
@z

@x
@d etex_convert_codes=etex_convert_base+1 {end of \eTeX's command codes}
@d job_name_code=etex_convert_codes {command code for \.{\\jobname}}
@y
@d etex_convert_codes=etex_convert_base+1 {end of \eTeX's command codes}
@d jstex_first_expand_code = etex_convert_codes {base for \jsTeX's command codes}
@d strcmp_code = jstex_first_expand_code {command code for \.{\\strcmp}}
@d uchar_code = jstex_first_expand_code+1 {command code for \.{\\Uchar}}
@d ucharcat_code = jstex_first_expand_code+2 {command code for \.{\\Ucharcat}}
@d filesize_code = jstex_first_expand_code+3 {command code for \.{\\filesize}}
@d kanjiskip_code = jstex_first_expand_code+4 {command code for \.{\\kanjiskip}}
@d shellescape_code = jstex_first_expand_code+5 {command code for \.{\\shellescape}}
@d expanded_code = jstex_first_expand_code+6 {command code for \.{\\expanded}}
@d jstex_revision_code = jstex_first_expand_code+7 {command code for \.{\\jsTeXrevision}}
@d snapshot_code = jstex_first_expand_code+8 {command code for \.{\\snapshot}}
@d jstex_convert_codes = jstex_first_expand_code+9 {end of \jsTeX's command codes}
@d job_name_code=jstex_convert_codes {command code for \.{\\jobname}}
@z

